import './css/reset.css';
import './css/style.css';
import './css/footer.css';
import './css/global-nav.css';
import './css/scroll-section.css';
import { setLayout } from './script/layout';
import { playAnimation } from './script/animation';
import { sceneInfoArray } from './script/sceneInfo';
import { getCalculatedSceneInfoArray } from './script/scene';
import {
  getNewCurrentScene,
  getNewCurrentSceneOnLoad,
  setShowScrolElementToBody,
} from './script/scroll';
import { drawImageOnLoad } from './script/video';

const setShowScrolElementToBodyByCurrentScene =
  setShowScrolElementToBody(document);

(() => {
  let calculatedSceneInfoArray = sceneInfoArray;
  let currentScene = 0;
  window.addEventListener('resize', () =>
    setLayout(
      window.innerHeight,
      getCalculatedSceneInfoArray(window, calculatedSceneInfoArray),
    ),
  );
  window.addEventListener('load', () => {
    calculatedSceneInfoArray = getCalculatedSceneInfoArray(
      window,
      calculatedSceneInfoArray,
      true,
    );

    const newCurrentScene = getNewCurrentSceneOnLoad(
      window.scrollY,
      calculatedSceneInfoArray,
    );

    setShowScrolElementToBodyByCurrentScene(newCurrentScene);
    setLayout(window.innerHeight, calculatedSceneInfoArray);
    drawImageOnLoad(calculatedSceneInfoArray[newCurrentScene]);

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
