import { constUndefined, flow, identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { setAttribute } from './dom';

import { type SceneInfo } from './sceneInfo';
import { getCalculatedCSSValue } from './animation';
import { setSceneInfoValue } from './scene';

const getCanvasContext = (canvasElement: HTMLCanvasElement) =>
  canvasElement.getContext('2d');

const drawImageToConvasContext =
  (image: HTMLImageElement) =>
  (canvasContext: ReturnType<typeof getCanvasContext>) =>
    pipe(
      canvasContext,
      O.fromNullable,
      O.map((canvasContext) => canvasContext.drawImage(image, 0, 0)),
    );

const getImagePath = (folder: string) => (num: number) =>
  `${folder}/${num.toString().padStart(4, '0')}.JPG`;

const createImage = (src: string) =>
  pipe(new Image(), setAttribute('src', src));

const getVideoImages = (sceneInfo: SceneInfo) =>
  pipe(
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

const setVideoImages = (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo,
    getVideoImages,
    O.match(() => [] as Array<HTMLImageElement>, identity),
    (videoImages) =>
      pipe(
        sceneInfo.canvas,
        O.fromNullable,
        O.match(constUndefined, (canvas) => ({ ...canvas, videoImages })),
        setSceneInfoValue('canvas', sceneInfo),
      ),
  );

const playVideo =
  (currentSceneScrollHeight: number, currentSceneScrollY: number) =>
  (canvas: SceneInfo['canvas']) => {
    pipe(
      canvas,
      O.fromNullable,
      O.map(({ imageSequence, element, videoImages }) =>
        pipe(
          getCalculatedCSSValue(
            imageSequence,
            currentSceneScrollHeight,
            currentSceneScrollY,
          ),
          O.map(Math.round),
          O.map((calculatedImageSequence) =>
            pipe(
              element,
              O.map(
                flow(
                  getCanvasContext,
                  drawImageToConvasContext(
                    videoImages[calculatedImageSequence],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  };

export { getVideoImages, setVideoImages, playVideo };
