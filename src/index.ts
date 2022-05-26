import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';

import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { playAnimation } from './script/animation';
import { sceneInfoArray } from './script/sceneInfo';
import { getCalculatedSceneInfo } from './script/scene';
import {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
} from './script/scroll';
import { setVideoImages } from './script/video';

const setShowScrolElementToBodyByCurrentScene =
  setShowScrolElementToBody(document);

(() => {
  let calculatedSceneInfoArray: typeof sceneInfoArray = sceneInfoArray;
  let currentScene = 0;
  const getCalculatedSceneInfoByInnerHeight = getCalculatedSceneInfo(
    calculatedSceneInfoArray,
  );
  window.addEventListener('resize', () =>
    setLayout(getCalculatedSceneInfoByInnerHeight(window)),
  );
  window.addEventListener('load', () => {
    calculatedSceneInfoArray = pipe(
      window,
      getCalculatedSceneInfoByInnerHeight,
      A.map(setVideoImages),
    );

    const newCurrentScene = getNewCurrentSceneOnLoad(
      window.scrollY,
      calculatedSceneInfoArray,
    );

    setShowScrolElementToBodyByCurrentScene(newCurrentScene);
    setLayout(calculatedSceneInfoArray);

    currentScene = newCurrentScene;
  });
  window.addEventListener('scroll', () => {
    const [newCurrentScene, prevScrollHeight] = getNewCurrentScene(
      window.scrollY,
      currentScene,
      calculatedSceneInfoArray,
    );

    setShowScrolElementToBodyByCurrentScene(newCurrentScene);

    if (currentScene === newCurrentScene) {
      playAnimation(calculatedSceneInfoArray)(
        newCurrentScene,
        prevScrollHeight,
        window.scrollY,
      );
    }

    currentScene = newCurrentScene;
  });
})();
