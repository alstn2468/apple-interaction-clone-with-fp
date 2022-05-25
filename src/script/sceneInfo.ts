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
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.1, end: 0.2 } },
          out: { start: 1, end: 0, timing: { start: 0.25, end: 0.3 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translateY({value}%)',
            timing: { start: 0.1, end: 0.2 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translateY({value}%)',
            timing: { start: 0.25, end: 0.3 },
          },
        },
      },
      { /* #scroll-section-0 .main-message:nth-child(1) */
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.3, end: 0.4 } },
          out: { start: 1, end: 0, timing: { start: 0.45, end: 0.5 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translateY({value}%)',
            timing: { start: 0.3, end: 0.4 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translateY({value}%)',
            timing: { start: 0.45, end: 0.5 },
          },
        },
      },
      { /* #scroll-section-0 .main-message:nth-child(2) */
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.5, end: 0.6 } },
          out: { start: 1, end: 0, timing: { start: 0.65, end: 0.7 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translateY({value}%)',
            timing: { start: 0.5, end: 0.6 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translateY({value}%)',
            timing: { start: 0.65, end: 0.7 },
          },
        },
      },
      { /* #scroll-section-0 .main-message:nth-child(3) */
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.7, end: 0.8 } },
          out: { start: 1, end: 0, timing: { start: 0.85, end: 0.9 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translateY({value}%)',
            timing: { start: 0.7, end: 0.8 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translateY({value}%)',
            timing: { start: 0.85, end: 0.9 },
          },
        },
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
