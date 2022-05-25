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

const getCalculatedSceneInfoByInnerHeight = getCalculatedSceneInfo(sceneInfoArray);
const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);

window.addEventListener(
  'resize',
  () => setLayout(getCalculatedSceneInfoByInnerHeight(window)),
);

(() => {
  let currentScene = 0;
  window.addEventListener(
    'load',
    () => {
      const calculatedSceneInfo = getCalculatedSceneInfoByInnerHeight(window);
      const newCurrentScene = getNewCurrentSceneOnLoad(
        window.scrollY,
        calculatedSceneInfo,
      );

      setShowScrolElementToBodyByCurrentScene(newCurrentScene);
      setLayout(calculatedSceneInfo);

      currentScene = newCurrentScene;
    },
  );
  window.addEventListener(
    'scroll',
    () => {
      const calculatedSceneInfo = getCalculatedSceneInfoByInnerHeight(window);
      const [newCurrentScene, prevScrollHeight] = getNewCurrentScene(
        window.scrollY,
        currentScene,
        calculatedSceneInfo,
      );

      setShowScrolElementToBodyByCurrentScene(newCurrentScene);

      if (currentScene === newCurrentScene) {
        playAnimation
          (calculatedSceneInfo)
          (newCurrentScene, prevScrollHeight, window.scrollY);
      }

      currentScene = newCurrentScene;
    },
  );
})();

