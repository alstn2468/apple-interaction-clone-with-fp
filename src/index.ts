import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { scrollInfoArray, getCalculatedScrollInfo } from './script/scrollInfo';
import {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
} from './script/scroll';

const getCalculatedScrollInfoByInnerHeight = getCalculatedScrollInfo(scrollInfoArray);
const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);

const initalCalcuatedScrollInfo = getCalculatedScrollInfoByInnerHeight(window.innerHeight);

window.addEventListener(
  'resize',
  () => setLayout(document, getCalculatedScrollInfoByInnerHeight(window.innerHeight)),
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
        initalCalcuatedScrollInfo,
      );
      setShowScrolElementToBodyByCurrentScene(currentScene);
    },
  )
  window.addEventListener(
    'load',
    () => {
      currentScene = getNewCurrentSceneOnLoad(window.scrollY, initalCalcuatedScrollInfo);
      setShowScrolElementToBodyByCurrentScene(currentScene);
      setLayout(
        document,
        initalCalcuatedScrollInfo,
      );
    },
  );
})();

