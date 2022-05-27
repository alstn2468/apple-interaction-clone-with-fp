import type { Animation, AnimationValue } from './animation';
import * as O from 'fp-ts/lib/Option';

type SceneType = 'sticky' | 'normal';
type SceneInfo = {
  // 브라우저 높이의 배수
  heightMultiple: number;
  scrollHeight: number;
  type: SceneType;
  selectors: Array<string>;
  canvas?: {
    element: O.Option<HTMLCanvasElement>;
    folder: string;
    videoImageCount: number;
    imageSequence: AnimationValue;
    videoImages: Array<HTMLImageElement>;
  };
  objs: {
    container: O.Option<HTMLElement>;
    elements: Array<HTMLElement>;
  };
  animations: Array<Animation>;
};

const sceneInfoArray: SceneInfo[] = [
  {
    // #scroll-section-0
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    selectors: ['.sticky-element:not(.sticky-element-canvas)'],
    canvas: {
      element: O.none,
      videoImageCount: 300,
      folder: './video/001',
      imageSequence: { start: 0, end: 299 },
      videoImages: [],
    },
    objs: {
      container: O.none,
      elements: [],
    },
    animations: [
      {
        // #scroll-section-0 .sticky-element:nth-child(1)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.1, end: 0.2 } },
          out: { start: 1, end: 0, timing: { start: 0.25, end: 0.3 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.1, end: 0.2 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.25, end: 0.3 },
          },
        },
      },
      {
        // #scroll-section-0 .sticky-element:nth-child(2)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.3, end: 0.4 } },
          out: { start: 1, end: 0, timing: { start: 0.45, end: 0.5 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.3, end: 0.4 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.45, end: 0.5 },
          },
        },
      },
      {
        // #scroll-section-0 .sticky-element:nth-child(3)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.5, end: 0.6 } },
          out: { start: 1, end: 0, timing: { start: 0.65, end: 0.7 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.5, end: 0.6 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.65, end: 0.7 },
          },
        },
      },
      {
        // #scroll-section-0 .sticky-element:nth-child(4)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.7, end: 0.8 } },
          out: { start: 1, end: 0, timing: { start: 0.85, end: 0.9 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.7, end: 0.8 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.85, end: 0.9 },
          },
        },
      },
    ],
  },
  {
    // #scroll-section-1
    type: 'normal',
    heightMultiple: 5,
    scrollHeight: 0,
    selectors: [],
    objs: {
      container: O.none,
      elements: [],
    },
    animations: [],
  },
  {
    // #scroll-section-2
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    selectors: ['.sticky-element', '.pin'],
    objs: {
      container: O.none,
      elements: [],
    },
    animations: [
      {
        // #scroll-section-2 .sticky-element:nth-child(1)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.15, end: 0.2 } },
          out: { start: 1, end: 0, timing: { start: 0.3, end: 0.35 } },
        },
        transform: {
          in: {
            start: 20,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.15, end: 0.2 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.3, end: 0.35 },
          },
        },
      },
      {
        // #scroll-section-2 .sticky-element:nth-child(2)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.5, end: 0.55 } },
          out: { start: 1, end: 0, timing: { start: 0.58, end: 0.63 } },
        },
        transform: {
          in: {
            start: 30,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.5, end: 0.55 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.58, end: 0.63 },
          },
        },
      },
      {
        // #scroll-section-2 .sticky-element:nth-child(3)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.72, end: 0.77 } },
          out: { start: 1, end: 0, timing: { start: 0.85, end: 0.9 } },
        },
        transform: {
          in: {
            start: 30,
            end: 0,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.72, end: 0.77 },
          },
          out: {
            start: 0,
            end: -20,
            template: 'translate3d(0, {value}%, 0)',
            timing: { start: 0.85, end: 0.9 },
          },
        },
      },
      {
        // #scroll-section-2 .pin:nth-child(1)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.5, end: 0.55 } },
          out: { start: 1, end: 0, timing: { start: 0.58, end: 0.63 } },
        },
        transform: {
          in: {
            start: 0.5,
            end: 1,
            template: 'scaleY({value})',
            timing: { start: 0.5, end: 0.55 },
          },
          out: {
            start: 0.5,
            end: 1,
            template: 'scaleY({value})',
            timing: { start: 0.5, end: 0.55 },
          },
        },
      },
      {
        // #scroll-section-2 .pin:nth-child(2)
        opacity: {
          in: { start: 0, end: 1, timing: { start: 0.72, end: 0.77 } },
          out: { start: 1, end: 0, timing: { start: 0.85, end: 0.9 } },
        },
        transform: {
          in: {
            start: 0.5,
            end: 1,
            template: 'scaleY({value})',
            timing: { start: 0.72, end: 0.77 },
          },
          out: {
            start: 0.5,
            end: 1,
            template: 'scaleY({value})',
            timing: { start: 0.72, end: 0.77 },
          },
        },
      },
    ],
  },
  {
    // #scroll-section-3
    type: 'sticky',
    heightMultiple: 5,
    scrollHeight: 0,
    objs: {
      container: O.none,
      elements: [],
    },
    selectors: ['.canvas-caption'],
    animations: [
      {
        // #scroll-section-2 .canvas-caption:nth-child(1)
        opacity: { start: 0, end: 1 },
        transform: {
          start: 20,
          end: 0,
          template: 'translate3d(0, {value}%, 0)',
        },
      },
    ],
  },
];

export { type SceneInfo, sceneInfoArray };
