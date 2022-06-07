import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { constVoid, identity, pipe } from 'fp-ts/lib/function';

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

const getImages = (sceneInfo: SceneInfo) => {
  switch (sceneInfo.type) {
    case 'sticky':
      switch (sceneInfo.canvas.type) {
        case 'video':
          return pipe(
            NEA.range(0, sceneInfo.canvas.videoImageCount - 1),
            NEA.mapWithIndex(getImagePath(sceneInfo.canvas.folder)),
            NEA.map(createImage),
          );
        case 'image':
          return pipe(sceneInfo.canvas.imagePaths, A.map(createImage));
      }
  }
  return [];
};

const setVideoImages = (sceneInfo: SceneInfo) => {
  switch (sceneInfo.type) {
    case 'sticky':
      return pipe(sceneInfo, getImages, (images) =>
        pipe(
          sceneInfo.canvas,
          (canvas) => ({ ...canvas, images }),
          (canvas) => ({ ...sceneInfo, canvas }),
        ),
      );

    case 'normal':
      return sceneInfo;
  }
};

const drawImageOnLoad = (
  images: HTMLImageElement[],
  calculatedImageSequence: number,
  element: O.Option<HTMLCanvasElement>,
) =>
  (images[calculatedImageSequence].onload = () =>
    pipe(element, drawImageToCanvasContext(images[calculatedImageSequence])));

const playVideo = (
  canvas: VideoCanvas,
  scrollHeight: number,
  currentSceneScrollY: number,
  isFirstLoad: boolean,
) =>
  pipe(
    getCalculatedCSSValue(
      canvas.imageSequence,
      scrollHeight,
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
              drawImageToCanvasContext(canvas.images[calculatedImageSequence]),
            ),
          () =>
            drawImageOnLoad(
              canvas.images,
              calculatedImageSequence,
              canvas.element,
            ),
        ),
      ),
    ),
  );

const playCanvasAnimation = (
  sceneInfo: SceneInfo,
  currentSceneScrollY: number,
  isFirstLoad = false,
) => {
  switch (sceneInfo.type) {
    case 'sticky':
      switch (sceneInfo.canvas.type) {
        case 'video': {
          return playVideo(
            sceneInfo.canvas,
            sceneInfo.scrollHeight,
            currentSceneScrollY,
            isFirstLoad,
          );
        }
        case 'image': {
          return drawImageOnLoad(
            sceneInfo.canvas.images,
            0,
            sceneInfo.canvas.element,
          );
        }
      }
  }
};

export { setVideoImages, playCanvasAnimation };
