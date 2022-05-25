import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { constVoid, pipe } from 'fp-ts/lib/function';

import { setElementStyle } from './dom';
import { type SceneInfo } from './sceneInfo';

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
  );

const setLayout = (sceneInfoArray: SceneInfo[]) =>
  pipe(sceneInfoArray, A.map(setElementScrollHeight));

export { setLayout };
