import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';

type SceneType = 'sticky' | 'normal';
type SceneInfo = {
  // 브라우저 높이의 배수
  heightMultiple: number,
  scrollHeight: number,
  type: SceneType,
  objs: {
    container: O.Option<HTMLElement>,
  },
};

const sceneInfoArray: SceneInfo[] = [
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
  (innerHeight: number) =>
    pipe(
      sceneInfoArray,
      A.map(setScrollHeight(innerHeight)),
    );

export {
  type SceneInfo,
  sceneInfoArray,
  setSceneInfoValue,
  getSceneInfoValue,
  getCalculatedSceneInfo,
};
