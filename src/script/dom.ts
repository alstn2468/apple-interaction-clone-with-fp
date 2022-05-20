import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

const getElementById = (id: string) =>
  (document: Document) =>
    pipe(document.getElementById(id), O.fromNullable);

const querySelector = (selector: string) =>
  (document: Document) =>
    pipe(document.querySelector(selector), O.fromNullable);

const addClassName = (className: string) =>
  (element: Element) =>
    (element.classList.add(className), element);

const removeClassName = (className: string) =>
  (element: Element) =>
    (element.classList.remove(className), element);

const setAttribute = (attribute: string, value: string) =>
  (element: Element) =>
    (element.setAttribute(attribute, value), element);

const removeChild = (child: Node) =>
  (element: Element) =>
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

const addWindowEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions | undefined,
) =>
  (window: Window) =>
    (window.addEventListener(type, listener, options), window);

const addElementEventListener = <K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => unknown,
  options?: boolean | AddEventListenerOptions | undefined,
) =>
  (element: HTMLElement) =>
    (element.addEventListener(type, listener, options), element);

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
  addWindowEventListener,
  addElementEventListener,
};
