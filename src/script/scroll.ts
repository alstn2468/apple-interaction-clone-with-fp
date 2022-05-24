import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';

import { setAttributeToBody } from './dom';
import { type SceneInfo } from './sceneInfo';

const getScrollHeightValue = (
  currentScene: number,
  sceneInfoArray: SceneInfo[],
): [number, number] => {
  const prevScrollHeight = pipe(
    sceneInfoArray,
    A.filterWithIndex((index) => index < currentScene),
    A.reduce(0, (b, a) => b + a.scrollHeight),
  );

  return [prevScrollHeight, sceneInfoArray[currentScene].scrollHeight];
};

const getNewCurrentScene = (
  scrollY: number,
  currentScene: number,
  sceneInfoArray: SceneInfo[],
) => {
  let newCurrentScene = currentScene;

  const [prevScrollHeight, currentSceneScrollHeight] = getScrollHeightValue(
    currentScene,
    sceneInfoArray,
  );

  if (scrollY < prevScrollHeight
    && newCurrentScene !== 0) {
    newCurrentScene -= 1;
  }

  if (scrollY > prevScrollHeight + currentSceneScrollHeight
    && currentScene < sceneInfoArray.length) {
    newCurrentScene += 1;
  }

  return [newCurrentScene, scrollY - prevScrollHeight] as const;
};

const getNewCurrentSceneOnLoad = (scrollY: number, sceneInfoArray: SceneInfo[]) => {
  let totalScrollHeight = 0;

  for (const [index, sceneInfo] of sceneInfoArray.entries()) {
    totalScrollHeight += sceneInfo.scrollHeight;

    if (totalScrollHeight >= scrollY) {
      return index;
    }
  }

  return 0;
}

const getShowScrollElementId = (currentScene: number) =>
  `show-scroll-section-${currentScene}`;

const setShowScrolElementToBody = (document: Document) =>
  (currentScene: number) =>
    pipe(
      document,
      setAttributeToBody('id', getShowScrollElementId(currentScene)),
    );

export {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
};
