import { pipe } from 'fp-ts/lib/function';

import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { playAnimation } from './script/animation';
import { sceneInfoArray, getCalculatedSceneInfo } from './script/sceneInfo';
import {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
} from './script/scroll';

const getCalculatedSceneInfoByInnerHeight = getCalculatedSceneInfo(sceneInfoArray);

const initalCalcuatedSceneInfo = getCalculatedSceneInfoByInnerHeight(window);

const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);
const playAnimationWithCalculatedSceneInfo = playAnimation(initalCalcuatedSceneInfo);

window.addEventListener(
  'resize',
  () => pipe(
    getCalculatedSceneInfoByInnerHeight(window),
    setLayout,
  ),
);

(() => {
  // TODO: 클로저를 이용하지 않는 더 좋은 방법이 없을까?
  let currentScene = 0; // Using Closure with IIFE
  window.addEventListener(
    'load',
    () => {
      const newCurrentScene = getNewCurrentSceneOnLoad(
        window.scrollY,
        initalCalcuatedSceneInfo,
      );

      setShowScrolElementToBodyByCurrentScene(newCurrentScene);
      setLayout(initalCalcuatedSceneInfo);

      currentScene = newCurrentScene;
    },
  );
  window.addEventListener(
    'scroll',
    () => {
      const [newCurrentScene, prevScrollHeight] = getNewCurrentScene(
        window.scrollY,
        currentScene,
        initalCalcuatedSceneInfo,
      );

      setShowScrolElementToBodyByCurrentScene(newCurrentScene);

      if (currentScene === newCurrentScene) {
        playAnimationWithCalculatedSceneInfo(
          newCurrentScene,
          prevScrollHeight,
          window.scrollY,
        );
      }

      currentScene = newCurrentScene;
    },
  );
})();

