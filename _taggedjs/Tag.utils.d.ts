import { ValueSubject } from "./ValueSubject.js";
import { Tag } from "./Tag.class.js";
import { TemplaterResult } from "./tag.js";
export declare function getSubjectFunction(value: any, tag: Tag): ValueSubject;
/**
 * @param {*} value
 * @param {Tag} tag
 * @returns
 */
export declare function bindSubjectFunction(value: (...args: any[]) => any, tag: Tag): {
    (element: Element, args: any[]): any;
    tagFunction: (...args: any[]) => any;
};
/**
 *
 * @param {*} templater
 * @param {ExistingValue} existing
 * @param {Tag} ownerTag
 */
export declare function setValueRedraw(templater: TemplaterResult, // latest tag function to call for rendering
existing: any, ownerTag: Tag): void;
export declare function elementDestroyCheck(nextSibling: Element & {
    ondestroy?: () => any;
}, stagger: number): any;
