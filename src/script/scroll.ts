import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';

import { setAttributeToBody } from './dom';
import { type ScrollInfo } from './scrollInfo';

const getScrollHeightValue = (
  currentScene: number,
  scrollInfoArray: ScrollInfo[],
): [number, number] => {
  const prevScrollHeight = pipe(
    scrollInfoArray,
    A.filterWithIndex((index) => index < currentScene),
    A.reduce(0, (b, a) => b + a.scrollHeight),
  );

  return [prevScrollHeight, scrollInfoArray[currentScene].scrollHeight];
};

const getNewCurrentScene = (window: Window, scrollInfoArray: ScrollInfo[]) =>
  (currentScene: number) => {
    let newCurrentScene = currentScene;

    const [prevScrollHeight, currentSceneScrollHeight] = getScrollHeightValue(
      currentScene,
      scrollInfoArray,
    );

    if (window.scrollY < prevScrollHeight
      && newCurrentScene !== 0) {
      newCurrentScene -= 1;
    }

    if (window.scrollY > prevScrollHeight + currentSceneScrollHeight
      && currentScene < scrollInfoArray.length) {
      newCurrentScene += 1;
    }

    return newCurrentScene;
  };

const getNewCurrentSceneOnLoad = (window: Window) =>
  (scrollInfoArray: ScrollInfo[]) => {
    let totalScrollHeight = 0;

    for (const [index, scrollInfo] of scrollInfoArray.entries()) {
      totalScrollHeight += scrollInfo.scrollHeight;

      if (totalScrollHeight >= window.scrollY) {
        return index;
      }
    }

    return 0;
  }

const getShowScrollElementId = (currentScene: number) =>
  `show-scroll-section-${currentScene}`;

const setShowScrolElementToBody = (document: Document) => (currentScene: number) =>
  pipe(
    document,
    setAttributeToBody('id', getShowScrollElementId(currentScene)),
  );

export {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
};
