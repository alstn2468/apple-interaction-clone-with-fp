import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

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

const setSceneInfoElementObject = (document: Document) =>
  (index: number, sceneInfo: SceneInfo) =>
    pipe(
      index,
      getScrollSectionElement(document),
      (element) => pipe(
        element,
        O.chain((element) =>
          O.some(element.querySelectorAll('.sticky-element') as NodeListOf<HTMLElement>)
        ),
        O.chain((messages) => O.some({
          ...sceneInfo.objs,
          container: element,
          messages: Array.from(messages),
        })),
      ),
      O.match(
        () => sceneInfo,
        setSceneInfoValue('objs', sceneInfo),
      ),
    );

const setElementScrollHeight = (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo.objs.container,
    O.map(setElementStyle('height', `${sceneInfo.scrollHeight}px`)),
    () => sceneInfo,
  );

const setLayout = (sceneInfoArray: SceneInfo[]) =>
  pipe(
    sceneInfoArray,
    A.map(setElementScrollHeight),
  );

export {
  getScrollSectionElements,
  setSceneInfoElementObject,
  setLayout,
};
