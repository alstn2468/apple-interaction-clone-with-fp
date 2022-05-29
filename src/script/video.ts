import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { constUndefined, constVoid, identity, pipe } from 'fp-ts/lib/function';

import { setAttribute } from './dom';
import { getCalculatedCSSValue } from './animation';

const getCanvasContext = (canvasElement: HTMLCanvasElement) =>
  O.fromNullable(canvasElement.getContext('2d'));

const drawImageToCanvasContext =
  (image: HTMLImageElement) => (element: O.Option<HTMLCanvasElement>) =>
    pipe(
      element,
      O.map(getCanvasContext),
      O.flatten,
      O.match(constVoid, (canvasContext) =>
        canvasContext.drawImage(image, 0, 0),
      ),
    );

const getImagePath = (folder: string) => (num: number) =>
  `${folder}/${num.toString().padStart(4, '0')}.JPG`;

const createImage = (src: string) =>
  pipe(new Image(), setAttribute('src', src));

const getVideoImages = (sceneInfo: SceneInfo) => {
  switch (sceneInfo.type) {
    case 'sticky':
      switch (sceneInfo.canvas?.type) {
        case 'video':
          return pipe(
            sceneInfo.canvas,
            O.fromNullable,
            O.map((canvas) =>
              pipe(
                NEA.range(0, canvas.videoImageCount - 1),
                NEA.mapWithIndex(getImagePath(canvas.folder)),
                NEA.map(createImage),
              ),
            ),
          );
      }
  }
  return O.none;
};

const setVideoImages = (sceneInfo: SceneInfo) => {
  switch (sceneInfo.type) {
    case 'sticky':
      return pipe(
        sceneInfo,
        getVideoImages,
        O.match(() => [] as Array<HTMLImageElement>, identity),
        (videoImages) =>
          pipe(
            sceneInfo.canvas,
            O.fromNullable,
            O.match(constUndefined, (canvas) => ({ ...canvas, videoImages })),
            (canvas) => ({ ...sceneInfo, canvas }),
          ),
      );

    case 'normal':
      return sceneInfo;
  }
};

const drawImageOnLoad = (
  videoImages: HTMLImageElement[],
  calculatedImageSequence: number,
  element: O.Option<HTMLCanvasElement>,
) =>
  (videoImages[calculatedImageSequence].onload = () =>
    pipe(
      element,
      drawImageToCanvasContext(videoImages[calculatedImageSequence]),
    ));

const playVideo = (
  sceneInfo: SceneInfo,
  currentSceneScrollY: number,
  isFirstLoad = false,
) => {
  switch (sceneInfo.type) {
    case 'sticky':
      pipe(
        sceneInfo.canvas,
        O.fromNullable,
        O.map((canvas) => {
          switch (canvas.type) {
            case 'video':
              pipe(
                getCalculatedCSSValue(
                  canvas.imageSequence,
                  sceneInfo.scrollHeight,
                  currentSceneScrollY,
                ),
                O.map(Math.round),
                O.map((calculatedImageSequence) =>
                  pipe(
                    isFirstLoad,
                    O.fromPredicate(Boolean),
                    O.match(
                      () =>
                        pipe(
                          canvas.element,
                          drawImageToCanvasContext(
                            canvas.videoImages[calculatedImageSequence],
                          ),
                        ),
                      () =>
                        drawImageOnLoad(
                          canvas.videoImages,
                          calculatedImageSequence,
                          canvas.element,
                        ),
                    ),
                  ),
                ),
              );
          }
        }),
      );
  }
};

export { getVideoImages, setVideoImages, playVideo };
