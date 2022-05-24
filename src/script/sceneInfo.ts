import { pipe } from 'fp-ts/lib/function';
import type { Animation } from './animation';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { setSceneInfoElementObject } from './layout';

type SceneType = 'sticky' | 'normal';
type SceneInfo = {
  // 브라우저 높이의 배수
  heightMultiple: number,
  scrollHeight: number,
  type: SceneType,
  objs: {
    container: O.Option<HTMLElement>,
    messages: Array<HTMLElement>,
  },
  animations: Array<Animation>,
};

const sceneInfoArray: SceneInfo[] = [
  { /* #scroll-section-0 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
      messages: [],
    },
    animations: [
      { /* #scroll-section-0 .main-message:nth-child(0) */
        opacity: { start: 0, end: 1, timing: { start: 0.1, end: 0.2 } },
      },
      { /* #scroll-section-0 .main-message:nth-child(1) */
        opacity: { start: 0, end: 1, timing: { start: 0.3, end: 0.4 } },
      },
    ],
  },
  { /* #scroll-section-1 */
    type: 'normal',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
      messages: [],
    },
    animations: [{}],
  },
  { /* #scroll-section-2 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
      messages: [],
    },
    animations: [{}],
  },
  { /* #scroll-section-3 */
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
      messages: [],
    },
    animations: [{}],
  },
];

const setSceneInfoValue = <
  T extends keyof SceneInfo
>(key: T, sceneInfo: SceneInfo) =>
  (value: SceneInfo[T]) =>
    ({ ...sceneInfo, [key]: value });

const getSceneInfoValue = <T extends keyof SceneInfo>(key: T) =>
  (sceneInfo: SceneInfo) =>
    sceneInfo[key];

const getScrollHeight = (innerHeight: number) =>
  (heightMultiple: number) =>
    innerHeight * heightMultiple;

const setScrollHeight = (innerHeight: number) =>
  (sceneInfo: SceneInfo) =>
    pipe(
      sceneInfo,
      getSceneInfoValue('heightMultiple'),
      getScrollHeight(innerHeight),
      setSceneInfoValue('scrollHeight', sceneInfo),
    );

const getCalculatedSceneInfo = (sceneInfoArray: SceneInfo[]) =>
  (window: Window) =>
    pipe(
      sceneInfoArray,
      A.map(setScrollHeight(window.innerHeight)),
      A.mapWithIndex(setSceneInfoElementObject(window.document)),
    );

export {
  type SceneInfo,
  sceneInfoArray,
  setSceneInfoValue,
  getSceneInfoValue,
  getCalculatedSceneInfo,
};
