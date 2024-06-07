import { TagSupport } from './TagSupport.class.js';
export type DestroyOptions = {
    stagger: number;
    byParent?: boolean;
};
export declare function getChildTagsToDestroy(childTags: TagSupport[], allTags?: TagSupport[]): TagSupport[];
