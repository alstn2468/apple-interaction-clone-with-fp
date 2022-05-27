import { constUndefined, pipe } from 'fp-ts/lib/function';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { getElementById, querySelector, querySelectorAll } from './dom';
import { type SceneInfo } from './sceneInfo';
import { setVideoImages } from './video';

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
              sceneInfo.selectors,
              A.map(querySelectorAll(element)),
              A.flatten,
              (elements) => ({
                ...sceneInfo.objs,
                container: optionElement,
                elements,
              }),
              setSceneInfoValue('objs', sceneInfo),
            ),
        ),
      ),
    );

const setCanvasElement =
  (document: Document) => (index: number, sceneInfo: SceneInfo) =>
    pipe(
      sceneInfo.canvas,
      O.fromNullable,
      O.match(constUndefined, (canvas) =>
        pipe(index, getScrollSectionElement(document), (optionElement) =>
          pipe(
            optionElement,
            O.match(constUndefined, (element) =>
              pipe(
                querySelector(element)(
                  '.video-canvas',
                ) as O.Option<HTMLCanvasElement>,
                (element) => ({ ...canvas, element }),
              ),
            ),
          ),
        ),
      ),
      setSceneInfoValue('canvas', sceneInfo),
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

const getCalculatedSceneInfoArray = (
  window: Window,
  sceneInfoArray: SceneInfo[],
  isFirstLoad = false,
) =>
  pipe(
    isFirstLoad,
    O.fromPredicate(Boolean),
    O.match(
      () => sceneInfoArray,
      () =>
        pipe(
          sceneInfoArray,
          A.map(setVideoImages),
          A.mapWithIndex(setSceneInfoElementObject(window.document)),
          A.mapWithIndex(setCanvasElement(window.document)),
        ),
    ),
    A.map(setScrollHeight(window.innerHeight)),
  );

export { setSceneInfoValue, getSceneInfoValue, getCalculatedSceneInfoArray };
