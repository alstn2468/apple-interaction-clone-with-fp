import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

import { setVideoImages } from './video';
import { getElementById, querySelector, querySelectorAll } from './dom';

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
          (element) => {
            switch (sceneInfo.type) {
              case 'sticky':
                return pipe(
                  sceneInfo.selectors,
                  A.map(querySelectorAll(element)),
                  A.flatten,
                  (elements) => ({
                    ...sceneInfo.objs,
                    container: optionElement,
                    elements,
                  }),
                  (objs) => ({ ...sceneInfo, objs }),
                );

              case 'normal':
                return sceneInfo;
            }
          },
        ),
      ),
    );

const setCanvasElement =
  (document: Document) => (index: number, sceneInfo: SceneInfo) => {
    switch (sceneInfo.type) {
      case 'sticky':
        return pipe(index, getScrollSectionElement(document), (optionElement) =>
          pipe(
            optionElement,
            O.match(
              () => sceneInfo.canvas,
              (element) =>
                pipe(
                  querySelector(element)(
                    '.video-canvas',
                  ) as O.Option<HTMLCanvasElement>,
                  (element) => ({ ...sceneInfo.canvas, element }),
                ),
            ),
            (canvas) => ({ ...sceneInfo, canvas }),
          ),
        );

      case 'normal':
        return sceneInfo;
    }
  };

const getElementScrollHeight =
  (innerHeight: number) => (sceneInfo: SceneInfo) => {
    switch (sceneInfo.type) {
      case 'sticky':
        return O.some(innerHeight * sceneInfo.heightMultiple);

      case 'normal':
        return pipe(
          sceneInfo.objs.container,
          O.match(
            () => O.none,
            (element) => O.some(element.offsetHeight),
          ),
        );
    }
  };

const setScrollHeight = (innerHeight: number) => (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo,
    getElementScrollHeight(innerHeight),
    O.match(
      () => sceneInfo,
      (scrollHeight) => ({ ...sceneInfo, scrollHeight }),
    ),
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

export { getCalculatedSceneInfoArray };
