import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

type ScrollType = 'sticky' | 'normal';
type ScrollInfo = {
  // 브라우저 높이의 배수
  heightMultiple: number,
  scrollHeight: number,
  type: ScrollType,
  objs: {
    container: O.Option<HTMLElement>,
  },
};

const scrollInfoArray: ScrollInfo[] = [
  { /* #scroll-section-0 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
    },
  },
  { /* #scroll-section-1 */
    type: 'normal',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
    },
  },
  { /* #scroll-section-2 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
    },
  },
  { /* #scroll-section-3 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
    },
  },
];

const setScrollInfoValue = <
  T extends keyof ScrollInfo
>(key: T, scrollInfo: ScrollInfo) =>
  (value: ScrollInfo[T]) =>
    ({ ...scrollInfo, [key]: value });

const getScrollInfoValue = <T extends keyof ScrollInfo>(key: T) =>
  (scrollInfo: ScrollInfo) =>
    scrollInfo[key];

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

const getCalculatedScrollInfo = (scrollInfoArray: ScrollInfo[]) =>
  (innerHeight: number) =>
    pipe(
      scrollInfoArray,
      A.map(setScrollHeight(innerHeight)),
    );

export {
  type ScrollInfo,
  scrollInfoArray,
  setScrollInfoValue,
  getScrollInfoValue,
  getCalculatedScrollInfo,
};
