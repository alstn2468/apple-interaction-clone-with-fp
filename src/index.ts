import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { sceneInfoArray, getCalculatedSceneInfo } from './script/sceneInfo';
import {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
} from './script/scroll';

const getCalculatedSceneInfoByInnerHeight = getCalculatedSceneInfo(sceneInfoArray);
const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);

const initalCalcuatedSceneInfo = getCalculatedSceneInfoByInnerHeight(window.innerHeight);

window.addEventListener(
  'resize',
  () => setLayout(document, getCalculatedSceneInfoByInnerHeight(window.innerHeight)),
);

(() => {
  // TODO: 클로저를 이용하지 않는 더 좋은 방법이 없을까?
  let currentScene = 0; // Using Closure with IIFE
  window.addEventListener(
    'scroll',
    () => {
      currentScene = getNewCurrentScene(
        window.scrollY,
        currentScene,
        initalCalcuatedSceneInfo,
      );
      setShowScrolElementToBodyByCurrentScene(currentScene);
    },
  )
  window.addEventListener(
    'load',
    () => {
      currentScene = getNewCurrentSceneOnLoad(window.scrollY, initalCalcuatedSceneInfo);
      setShowScrolElementToBodyByCurrentScene(currentScene);
      setLayout(
        document,
        initalCalcuatedSceneInfo,
      );
    },
  );
})();

