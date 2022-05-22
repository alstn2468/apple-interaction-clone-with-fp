import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { scrollInfoArray, getCalculatedScrollInfo } from './script/scrollInfo';
import {
  getNewCurrentScene,
  setShowScrolElementToBody,
} from './script/scroll';

const getCalculatedScrollInfoByInnerHeight = getCalculatedScrollInfo(scrollInfoArray);
const getNewCurrentSceneByCurrentScene = getNewCurrentScene(
  window,
  getCalculatedScrollInfoByInnerHeight(window.innerHeight),
);
const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);

window.addEventListener(
  'resize',
  () => setLayout(window, getCalculatedScrollInfoByInnerHeight(window.innerHeight)),
);

(() => {
  // TODO: 클로저를 이용하지 않는 더 좋은 방법이 없을까?
  let currentScene = 0; // Using Closure with IIFE
  window.addEventListener(
    'scroll',
    () => {
      currentScene = getNewCurrentSceneByCurrentScene(currentScene);
      setShowScrolElementToBodyByCurrentScene(currentScene);
    },
  )
  window.addEventListener(
    'load',
    () => {
      currentScene = setLayout(
        window,
        getCalculatedScrollInfoByInnerHeight(window.innerHeight),
      );
      setShowScrolElementToBodyByCurrentScene(currentScene);
    },
  );
})();

