import { pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { getElementById, querySelectorAll } from './dom';
import { type SceneInfo } from './sceneInfo';

const getScrollSectionId = (index: number) => `scroll-section-${index}`;

const getScrollSectionElement = (document: Document) => (index: number) =>
  pipe(document, getElementById(getScrollSectionId(index)));

const setSceneInfoElementObject =
  (document: Document) => (index: number, sceneInfo: SceneInfo) =>
    pipe(index, getScrollSectionElement(document), (optionElement) =>
      pipe(
        optionElement,
        O.match(
          () => sceneInfo,
          (element) =>
            pipe(
              sceneInfo.selector,
              A.map(querySelectorAll(element)),
              A.flatten,
              (messages) => ({
                ...sceneInfo.objs,
                container: optionElement,
                messages,
              }),
              setSceneInfoValue('objs', sceneInfo),
            ),
        ),
      ),
    );

const setSceneInfoValue =
  <T extends keyof SceneInfo>(key: T, sceneInfo: SceneInfo) =>
  (value: SceneInfo[T]) => ({ ...sceneInfo, [key]: value });

const getSceneInfoValue =
  <T extends keyof SceneInfo>(key: T) =>
  (sceneInfo: SceneInfo) =>
    sceneInfo[key];

const getElementScrollHeight =
  (innerHeight: number) => (sceneInfo: SceneInfo) =>
    pipe(
      sceneInfo,
      O.fromPredicate((sceneInfo) => sceneInfo.type === 'sticky'),
      O.match(
        () =>
          pipe(
            sceneInfo.objs.container,
            O.match(
              () => O.none,
              (element) => O.some(element.offsetHeight),
            ),
          ),
        () => O.some(innerHeight * sceneInfo.heightMultiple),
      ),
    );

const setScrollHeight = (innerHeight: number) => (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo,
    getElementScrollHeight(innerHeight),
    O.match(() => sceneInfo, setSceneInfoValue('scrollHeight', sceneInfo)),
  );

const getCalculatedSceneInfo =
  (sceneInfoArray: SceneInfo[]) => (window: Window) =>
    pipe(
      sceneInfoArray,
      A.mapWithIndex(setSceneInfoElementObject(window.document)),
      A.map(setScrollHeight(window.innerHeight)),
    );

export { setSceneInfoValue, getSceneInfoValue, getCalculatedSceneInfo };
