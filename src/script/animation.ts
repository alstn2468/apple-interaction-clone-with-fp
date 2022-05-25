import type * as CSS from 'csstype';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, constVoid } from 'fp-ts/lib/function';

import { SceneInfo } from './sceneInfo';
import { setElementStyle } from './dom';

type CSSValue = number | string;
type AnimationValue = {
  start: CSSValue,
  end: CSSValue,
  timing?: { start: number, end: number },
};
type Animation = {
  [key in keyof CSS.Properties]?: AnimationValue;
};

const getValue = (start: CSSValue, end: CSSValue) =>
  (ratio: number) => {
    if (typeof start === 'number' && typeof end === 'number') {
      return O.some((end - start) * ratio + start);
    }
    return O.none;
  }

const getCalculatedCSSValue = (
  value: Animation[keyof CSS.Properties],
  currentSceneScrollHeight: number,
  currentSceneScrollY: number,
) => pipe(
  value,
  O.fromNullable,
  O.match(
    () => O.none,
    ({ start, end, timing }) => {
      const getValueByRatio = getValue(start, end);
      if (timing) {
        const startHeight = timing.start * currentSceneScrollHeight;
        const endHeight = timing.end * currentSceneScrollHeight;

        if (startHeight <= currentSceneScrollY
          && currentSceneScrollY <= endHeight) {
          return getValueByRatio(
            (currentSceneScrollY - startHeight) / (endHeight - startHeight)
          );
        }
        if (currentSceneScrollY < startHeight) {
          return O.some(start);
        }
        if (currentSceneScrollY > endHeight) {
          return O.some(end);
        }
      }
      return getValueByRatio(currentSceneScrollY / currentSceneScrollHeight);
    },
  ),
);

const getCalculatedAnimationObjects = (
  currentSceneScrollHeight: number,
  currentSceneScrollY: number,
) => (animation: Animation) =>
  pipe(
    Object.entries(animation),
    A.map(([key, value]) => ({
      key,
      value: getCalculatedCSSValue(
        value,
        currentSceneScrollHeight,
        currentSceneScrollY
      ),
      timing: value?.timing,
    })),
  );

type AnimationObjects = ReturnType<ReturnType<typeof getCalculatedAnimationObjects>>;
const applyAnimationObjectStyleToElement = (element: HTMLElement) =>
  (animationObjects: AnimationObjects) =>
    pipe(
      animationObjects,
      A.map(({ key, value }) =>
        pipe(
          value,
          O.match(
            () => constVoid,
            (cssValue) => setElementStyle(key, cssValue.toString()),
          ),
          (setStyle) => setStyle(element),
        ),
      ),
    );

const playAnimation = (sceneInfoArray: SceneInfo[]) =>
  (currentScene: number, currentSceneScrollY: number) =>
    pipe(
      sceneInfoArray[currentScene],
      O.fromNullable,
      O.match(
        constVoid,
        ({ objs: { messages }, animations, scrollHeight }) =>
          pipe(
            animations,
            A.map(getCalculatedAnimationObjects(scrollHeight, currentSceneScrollY)),
            A.zip(messages),
            A.map(([animationObjects, element]) => pipe(
              animationObjects,
              applyAnimationObjectStyleToElement(element),
            )),
          ),
      ),
    );

export {
  type Animation,
  playAnimation,
}
