import type * as CSS from 'csstype';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

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
            (currentSceneScrollY - startHeight) / endHeight - startHeight
          );
        }
        if (currentSceneScrollY < startHeight) {
          return start;
        }
        if (currentSceneScrollY > endHeight) {
          return end;
        }
      }
      return getValueByRatio(currentSceneScrollY / currentSceneScrollHeight);
    },
  ),
);

const playAnimation = (sceneInfoArray: SceneInfo[]) =>
  (currentScene: number, currentSceneScrollY: number) => {
    const currentSceneInfo = sceneInfoArray[currentScene];

    if (!currentSceneInfo) {
      return;
    }

    const { objs: { messages }, animations, scrollHeight } = currentSceneInfo;

    const calculatedAnimationValues = pipe(
      animations,
      A.map((animation) => Object.entries(animation)),
      A.map(
        A.map(([key, value]) => ({
          key,
          value: getCalculatedCSSValue(value, scrollHeight, currentSceneScrollY),
          timing: value.timing,
        })),
      ),
      console.log,
    );
  };

export {
  type Animation,
  playAnimation,
}
