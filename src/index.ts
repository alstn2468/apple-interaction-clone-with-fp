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
import { playVideo } from './script/video';

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
    const [, prevScrollHeight] = getNewCurrentScene(
      window.scrollY,
      newCurrentScene,
      calculatedSceneInfoArray,
    );
    const currentSceneScrollY = scrollY - prevScrollHeight;
    const currentSceneInfo = calculatedSceneInfoArray[newCurrentScene];

    setShowScrolElementToBodyByCurrentScene(newCurrentScene);
    setLayout(window.innerHeight, calculatedSceneInfoArray);
    playAnimation(currentSceneInfo, currentSceneScrollY);
    playVideo(currentSceneInfo, currentSceneScrollY, true);

    currentScene = newCurrentScene;
  });
  window.addEventListener('scroll', () => {
    const [newCurrentScene, prevScrollHeight] = getNewCurrentScene(
      window.scrollY,
      currentScene,
      calculatedSceneInfoArray,
    );
    const currentSceneScrollY = scrollY - prevScrollHeight;

    setShowScrolElementToBodyByCurrentScene(newCurrentScene);

    if (currentScene === newCurrentScene) {
      const currentSceneInfo = calculatedSceneInfoArray[newCurrentScene];
      playAnimation(currentSceneInfo, currentSceneScrollY);
      playVideo(currentSceneInfo, currentSceneScrollY);
    }

    currentScene = newCurrentScene;
  });
})();
