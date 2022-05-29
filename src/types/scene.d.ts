import { type Option } from 'fp-ts/lib/Option';

declare global {
  type Canvas =
    | {
        type: 'video';
        element: Option<HTMLCanvasElement>;
        folder: string;
        videoImageCount: number;
        imageSequence: AnimationValue;
        videoImages: Array<HTMLImageElement>;
      }
    | {
        type: 'image';
        element: Option<HTMLCanvasElement>;
      };
  type SceneInfo =
    | {
        heightMultiple: number;
        scrollHeight: number;
        type: 'sticky';
        selectors: Array<string>;
        canvas?: Canvas;
        objs: {
          container: Option<HTMLElement>;
          elements: Array<HTMLElement>;
        };
        animations: Array<SceneAnimation>;
      }
    | {
        type: 'normal';
        scrollHeight: number;
        objs: {
          container: Option<HTMLElement>;
        };
      };
}
