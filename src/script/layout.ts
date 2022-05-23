import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';

import { getElementById, setElementStyle } from './dom';
import {
  type ScrollInfo,
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

const setElementScrollHeight = (scrollInfo: ScrollInfo) =>
  pipe(
    scrollInfo.objs.container,
    O.map(setElementStyle('height', `${scrollInfo.scrollHeight}px`)),
    () => scrollInfo,
  );

const setLayout = (document: Document, scrollInfoArray: ScrollInfo[]) =>
  pipe(
    scrollInfoArray,
    A.mapWithIndex(setContainerObject(document)),
    A.map(setElementScrollHeight),
  );

export {
  getScrollSectionElements,
  setLayout,
};
