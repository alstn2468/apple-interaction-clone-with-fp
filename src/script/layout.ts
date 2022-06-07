import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { constVoid, pipe, flow } from 'fp-ts/lib/function';

import { setElementStyle } from './dom';

const setElementScrollHeight = (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo.objs.container,
    O.map((element) =>
      pipe(
        sceneInfo.scrollHeight,
        O.fromPredicate((scrollHeight) => scrollHeight !== 0),
        O.match(
          () => constVoid,
          (scrollHeight) =>
            setElementStyle('height', scrollHeight, '{value}px'),
        ),
        (apply) => apply(element),
      ),
    ),
    () => sceneInfo,
  );

const getImageCanvasScaleRatio = (
  window: Window,
  canvas: ImageCanvas['element'],
) =>
  pipe(
    canvas,
    O.match(
      () => 0,
      (canvas) => {
        const widthRatio = window.innerWidth / canvas.width;
        const heightRatio = window.innerHeight / canvas.height;
        if (widthRatio <= heightRatio) {
          return heightRatio;
        }
        return widthRatio;
      },
    ),
  );

const setCanvasScale = (window: Window) => (sceneInfo: SceneInfo) => {
  if (sceneInfo.type === 'sticky') {
    pipe(
      sceneInfo.canvas,
      ({ element, type }) => {
        switch (type) {
          case 'video':
            return {
              ratio: window.innerHeight / 1080,
              template: 'translate3d(-50%, -50%, 0) scale({value})',
            };
          case 'image':
            return {
              ratio: getImageCanvasScaleRatio(window, element),
              template: 'scale({value})',
            };
        }
      },
      ({ ratio, template }) =>
        pipe(
          sceneInfo.canvas.element,
          O.map(setElementStyle('transform', ratio, template)),
        ),
    );
  }

  return sceneInfo;
};

const setLayout = (window: Window, sceneInfoArray: SceneInfo[]) =>
  pipe(
    sceneInfoArray,
    A.map(flow(setElementScrollHeight, setCanvasScale(window))),
  );

export { setLayout };
