import { TagSupport } from "./getTagSupport.js";
import { ValueSubject } from "./ValueSubject.js";
import { TemplaterResult } from "./tag.js";
import { Subject } from "./Subject.js";
import { Tag } from "./Tag.class.js";
export type TagSubject = Subject & {
    tagSupport: TagSupport;
    tag: Tag;
};
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
existing: TagSubject, ownerTag: Tag): void;
export declare function redrawTag(existingTag: Tag | undefined, templater: TemplaterResult, // latest tag function to call for rendering
ownerTag?: Tag): {
    remit: boolean;
    retag: Tag;
};
export declare function elementDestroyCheck(nextSibling: Element & {
    ondestroy?: () => any;
}, stagger: number): any;
