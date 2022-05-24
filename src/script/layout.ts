import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';

import { getElementById, setElementStyle } from './dom';
import {
  type SceneInfo,
  setSceneInfoValue,
} from './sceneInfo';

const getScrollSectionId = (index: number) => `scroll-section-${index}`;

const getScrollSectionElement = (document: Document) =>
  (index: number) =>
    pipe(
      document,
      getElementById(getScrollSectionId(index)),
    );

const getScrollSectionElements = (document: Document) =>
  (sceneInfoArray: SceneInfo[]) =>
    pipe(
      sceneInfoArray,
      A.mapWithIndex(getScrollSectionElement(document)),
    );

const setContainerObject = (document: Document) =>
  (index: number, sceneInfo: SceneInfo) =>
    pipe(
      index,
      getScrollSectionElement(document),
      flow(
        (element) => ({ ...sceneInfo.objs, container: element }),
        setSceneInfoValue('objs', sceneInfo),
      ),
    );

const setElementScrollHeight = (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo.objs.container,
    O.map(setElementStyle('height', `${sceneInfo.scrollHeight}px`)),
    () => sceneInfo,
  );

const setLayout = (document: Document, sceneInfoArray: SceneInfo[]) =>
  pipe(
    sceneInfoArray,
    A.mapWithIndex(setContainerObject(document)),
    A.map(setElementScrollHeight),
  );

export {
  getScrollSectionElements,
  setLayout,
};
