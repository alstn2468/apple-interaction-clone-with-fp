import { pipe } from 'fp-ts/lib/function';

const getElementById = (id: string) =>
  (document: Document) =>
    [document, document.getElementById(id)] as const;

const querySelector = (selector: string) =>
  (document: Document) =>
    [document, document.querySelector(selector)] as const;

const addClassName = (className: string) =>
  (element: HTMLElement) =>
    (element.classList.add(className), element);

const removeClassName = (className: string) =>
  (element: HTMLElement) =>
    (element.classList.remove(className), element);

const setAttribute = (attribute: string, value: string) =>
  (element: HTMLElement) =>
    (element.setAttribute(attribute, value), element);

const removeChild = (child: Node) =>
  (element: HTMLElement) =>
    (element.removeChild(child), element);

const addClassNameToBody = (className: string) =>
  (document: Document) =>
    pipe(
      document.body,
      addClassName(className),
    );

const removeClassNameToBody = (className: string) =>
  (document: Document) =>
    pipe(
      document.body,
      removeClassName(className),
    );

const setAttributeToBody = (attribute: string, value: string) =>
  (document: Document) =>
    pipe(
      document.body,
      setAttribute(attribute, value),
    );

const removeChildToBody = (child: Node) =>
  (document: Document) =>
    pipe(
      document.body,
      removeChild(child),
    );

const addEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions | undefined,
) =>
  (window: Window) =>
    (window.addEventListener(type, listener, options), window);

export {
  getElementById,
  querySelector,
  addClassName,
  removeClassName,
  setAttribute,
  removeChild,
  addClassNameToBody,
  removeClassNameToBody,
  setAttributeToBody,
  removeChildToBody,
  addEventListener,
};
