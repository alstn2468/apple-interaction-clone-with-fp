import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';

import { getNewCurrentSceneOnLoad } from './scroll';
import { getElementById, setElementStyle } from './dom';
import {
  type ScrollInfo,
  getScrollInfoValue,
  setScrollInfoValue,
} from './scrollInfo';

const getScrollSectionId = (index: number) => `scroll-section-${index}`;

const getScrollSectionElement = (document: Document) =>
  (index: number) =>
    pipe(
      document,
      getElementById(getScrollSectionId(index)),
    );

const getScrollSectionElements = (document: Document) =>
  (scrollInfoArray: ScrollInfo[]) =>
    pipe(
      scrollInfoArray,
      A.mapWithIndex(getScrollSectionElement(document)),
    );

const setContainerObject = (document: Document) =>
  (index: number, scrollInfo: ScrollInfo) =>
    pipe(
      index,
      getScrollSectionElement(document),
      flow(
        (element) => ({ ...scrollInfo.objs, container: element }),
        setScrollInfoValue('objs', scrollInfo),
      ),
    );

const getScrollHeight = (innerHeight: number) =>
  (heightMultiple: number) =>
    innerHeight * heightMultiple;

const setScrollHeight = (innerHeight: number) =>
  (scrollInfo: ScrollInfo) =>
    pipe(
      scrollInfo,
      getScrollInfoValue('heightMultiple'),
      getScrollHeight(innerHeight),
      setScrollInfoValue('scrollHeight', scrollInfo),
    );

const getCalculatedScrollInfo = (innerHeight: number) =>
  (scrollInfoArray: ScrollInfo[]) => pipe(
    scrollInfoArray,
    A.map(setScrollHeight(innerHeight)),
  );

const setElementScrollHeight = (scrollInfo: ScrollInfo) =>
  pipe(
    scrollInfo.objs.container,
    O.map(setElementStyle('height', `${scrollInfo.scrollHeight}px`)),
    () => scrollInfo,
  );

const setLayout = (window: Window, scrollInfoArray: ScrollInfo[]) =>
  (innerHeight: number) =>
    pipe(
      scrollInfoArray,
      getCalculatedScrollInfo(innerHeight),
      A.mapWithIndex(setContainerObject(window.document)),
      A.map(setElementScrollHeight),
      getNewCurrentSceneOnLoad(window),
    );

export {
  getCalculatedScrollInfo,
  getScrollSectionElements,
  setLayout,
};
