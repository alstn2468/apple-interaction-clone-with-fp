import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import { setAttribute } from './dom';

import { type SceneInfo } from './sceneInfo';

const getCanvasContext = (canvasElement: HTMLCanvasElement) =>
  canvasElement.getContext('2d');

const getImagePath = (folder: string) => (num: number) =>
  `${folder}/${num.toString().padStart(4, '0')}.JPG`;

const createImage = (src: string) =>
  pipe(new Image(), setAttribute('src', src));

const getImageArray = (sceneInfo: SceneInfo) =>
  pipe(
    sceneInfo.canvas,
    O.fromNullable,
    O.map((canvas) =>
      pipe(
        NEA.range(0, canvas.videoImageCount - 1),
        NEA.mapWithIndex(getImagePath(canvas.folder)),
        NEA.map(createImage),
        console.log,
      ),
    ),
  );

export { getImageArray };
