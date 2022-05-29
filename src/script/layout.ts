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

const setCanvasScale = (innerHeight: number) => (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo.canvas,
    O.fromNullable,
    O.map(({ element }) =>
      pipe(
        element,
        O.map(
          setElementStyle(
            'transform',
            innerHeight / 1080,
            'translate3d(-50%, -50%, 0) scale({value})',
          ),
        ),
      ),
    ),
    () => sceneInfo,
  );

const setLayout = (innerHeight: number, sceneInfoArray: SceneInfo[]) =>
  pipe(
    sceneInfoArray,
    A.map(flow(setElementScrollHeight, setCanvasScale(innerHeight))),
  );

export { setLayout };
