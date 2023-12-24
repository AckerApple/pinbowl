import { Tag } from "./Tag.class.js";
export type OnInitCallback = () => unknown;
/** When undefined, it means a tag is being built for the first time so do run init(s) */
export declare let initCurrentTag: Tag | undefined;
export declare function setCurrentInitTag(tag: Tag | undefined): void;
export declare function onInit(callback: OnInitCallback): void;
