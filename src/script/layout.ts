import * as N from 'fp-ts/lib/number';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, flow } from 'fp-ts/lib/function';

import { type ScrollInfo, getScrollInfoValue, setScrollInfoValue } from './scrollInfo';
import { getElementById, setElementStyle } from './dom';

const getScrollSectionId = (index: number) => `scroll-section-${index}`;

const getScrollSectionElement = (document: Document) =>
  (index: number) =>
    pipe(
      document,
      getElementById(getScrollSectionId(index)),
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
    N.MonoidProduct.concat(innerHeight, heightMultiple);

const setScrollHeight = (innerHeight: number) =>
  (scrollInfo: ScrollInfo) =>
    pipe(
      scrollInfo,
      getScrollInfoValue('heightMultiple'),
      getScrollHeight(innerHeight),
      setScrollInfoValue('scrollHeight', scrollInfo),
    );

const setElementScrollHeight = (scrollInfo: ScrollInfo) =>
  pipe(
    scrollInfo.objs.container,
    O.map(setElementStyle('height', `${scrollInfo.scrollHeight}px`)),
    () => scrollInfo,
  );

const setLayout = (document: Document) =>
  (scrollInfoArray: ScrollInfo[]) =>
    (innerHeight: number) =>
      pipe(
        scrollInfoArray,
        A.map(setScrollHeight(innerHeight)),
        A.mapWithIndex(setContainerObject(document)),
        A.map(setElementScrollHeight),
      );

export {
  setLayout,
};
