import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { scrollInfoArray } from './script/scrollInfo';
import {
  getNewCurrentScene,
  setShowScrolElementToBody,
} from './script/scroll';

const setLayoutByInnerHeight = setLayout(window, scrollInfoArray);
const getNewCurrentSceneByCurrentScene = getNewCurrentScene(window, scrollInfoArray);
const setShowScrolElementToBodyByCurrentScene = setShowScrolElementToBody(document);

window.addEventListener(
  'resize',
  () => setLayoutByInnerHeight(window.innerHeight),
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
      currentScene = setLayoutByInnerHeight(window.innerHeight);
      setShowScrolElementToBodyByCurrentScene(currentScene);
    },
  );
})();

