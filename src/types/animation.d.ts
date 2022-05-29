import type * as CSS from 'csstype';

declare global {
  type CSSValue = number;
  type AnimationValue = {
    start: CSSValue;
    end: CSSValue;
    template?: string;
  };
  type AnimationValueWithTiming = {
    start: CSSValue;
    end: CSSValue;
    template?: string;
    timing: { start: number; end: number };
  };
  type SceneAnimation = {
    [key in keyof CSS.Properties]?:
      | { in: AnimationValueWithTiming; out: AnimationValueWithTiming }
      | AnimationValue;
  };
}
