import { type Option } from 'fp-ts/lib/Option';

declare global {
  type SceneType = 'sticky' | 'normal';
  type SceneInfo = {
    // 브라우저 높이의 배수
    heightMultiple: number;
    scrollHeight: number;
    type: SceneType;
    selectors: Array<string>;
    canvas?: {
      element: Option<HTMLCanvasElement>;
      folder: string;
      videoImageCount: number;
      imageSequence: AnimationValue;
      videoImages: Array<HTMLImageElement>;
    };
    objs: {
      container: Option<HTMLElement>;
      elements: Array<HTMLElement>;
    };
    animations: Array<SceneAnimation>;
  };
}
