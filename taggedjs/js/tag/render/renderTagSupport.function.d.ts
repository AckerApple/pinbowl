import { BaseTagSupport, TagSupport } from '../TagSupport.class.js';
/** Main function used by all other callers to render/update display of a tag component */
export declare function renderTagSupport<T extends TagSupport | BaseTagSupport>(tagSupport: T, // must be latest/newest state render
renderUp: boolean): T;
