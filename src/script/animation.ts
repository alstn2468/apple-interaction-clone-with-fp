import type * as CSS from 'csstype';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, constVoid } from 'fp-ts/lib/function';

import { setElementStyle } from './dom';

const getValue = (start: CSSValue, end: CSSValue) => (ratio: number) => {
  if (typeof start === 'number' && typeof end === 'number') {
    return O.some((end - start) * ratio + start);
  }
  return O.none;
};

const getCalculatedCSSValue = (
  value: AnimationValue | AnimationValueWithTiming,
  currentSceneScrollHeight: number,
  currentSceneScrollY: number,
) =>
  pipe(
    value,
    O.fromNullable,
    O.match(
      () => O.none,
      (value) => {
        const { start, end } = value;
        const getValueByRatio = getValue(start, end);
        if ('timing' in value) {
          const { timing } = value;
          const startHeight = timing.start * currentSceneScrollHeight;
          const endHeight = timing.end * currentSceneScrollHeight;

          if (
            startHeight <= currentSceneScrollY &&
            currentSceneScrollY <= endHeight
          ) {
            return getValueByRatio(
              (currentSceneScrollY - startHeight) / (endHeight - startHeight),
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

type InOutAnimationEntry = [
  string,
  Exclude<SceneAnimation[keyof CSS.Properties], undefined>,
];
const getInOrOutAnimation =
  (scrollRatio: number) =>
  ([key, value]: InOutAnimationEntry) => {
    if ('in' in value && 'out' in value) {
      return pipe(
        (value.in.timing.end + value.out.timing.start) / 2,
        O.fromPredicate((median) => scrollRatio <= median),
        O.match(
          () => [key, value.out] as const,
          () => [key, value.in] as const,
        ),
      );
    }

    return [key, value] as const;
  };

type AnimationEntry = ReturnType<ReturnType<typeof getInOrOutAnimation>>;
const getCalculatedAnimationObject =
  (currentSceneScrollHeight: number, currentSceneScrollY: number) =>
  ([key, value]: AnimationEntry) => {
    return {
      key,
      template: value.template,
      value: getCalculatedCSSValue(
        value,
        currentSceneScrollHeight,
        currentSceneScrollY,
      ),
    };
  };

const getCalculatedAnimationObjects =
  (currentSceneScrollHeight: number, currentSceneScrollY: number) =>
  (animation: SceneAnimation) => {
    const scrollRatio = currentSceneScrollY / currentSceneScrollHeight;
    return pipe(
      Object.entries(animation),
      A.map((animationEntry) =>
        pipe(
          animationEntry,
          getInOrOutAnimation(scrollRatio),
          getCalculatedAnimationObject(
            currentSceneScrollHeight,
            currentSceneScrollY,
          ),
        ),
      ),
    );
  };

type AnimationObjects = ReturnType<
  ReturnType<typeof getCalculatedAnimationObjects>
>;
const applyAnimationObjectStyleToElement =
  (element: HTMLElement) => (animationObjects: AnimationObjects) =>
    pipe(
      animationObjects,
      A.map(({ key, value, template }) =>
        pipe(
          value,
          O.match(
            () => constVoid,
            (cssValue) => setElementStyle(key, cssValue, template),
          ),
          (setStyle) => setStyle(element),
        ),
      ),
    );

const playAnimation = (sceneInfo: SceneInfo, currentSceneScrollY: number) =>
  pipe(
    sceneInfo,
    O.fromNullable,
    O.match(constVoid, (sceneInfo) => {
      switch (sceneInfo.type) {
        case 'sticky':
          pipe(
            sceneInfo.animations,
            A.map(
              getCalculatedAnimationObjects(
                sceneInfo.scrollHeight,
                currentSceneScrollY,
              ),
            ),
            A.zip(sceneInfo.objs.elements),
            A.map(([animationObjects, element]) =>
              pipe(
                animationObjects,
                applyAnimationObjectStyleToElement(element),
              ),
            ),
          );
      }
    }),
  );

export { playAnimation, getCalculatedCSSValue };
