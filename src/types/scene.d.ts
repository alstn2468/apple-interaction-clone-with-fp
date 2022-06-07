import { type Option } from 'fp-ts/lib/Option';

declare global {
  type VideoCanvas = {
    type: 'video';
    element: Option<HTMLCanvasElement>;
    folder: string;
    videoImageCount: number;
    imageSequence: AnimationValue;
    images: Array<HTMLImageElement>;
  };
  type ImageCanvas = {
    type: 'image';
    element: Option<HTMLCanvasElement>;
    imagePaths: Array<string>;
    images: Array<HTMLImageElement>;
  };
  type Canvas = VideoCanvas | ImageCanvas;

  type StickyScene = {
    heightMultiple: number;
    scrollHeight: number;
    type: 'sticky';
    selectors: Array<string>;
    canvas: Canvas;
    objs: {
      container: Option<HTMLElement>;
      elements: Array<HTMLElement>;
    };
    animations: Array<SceneAnimation>;
  };
  type NoramlScene = {
    type: 'normal';
    scrollHeight: number;
    objs: {
      container: Option<HTMLElement>;
    };
  };
  type SceneInfo = StickyScene | NoramlScene;
}
