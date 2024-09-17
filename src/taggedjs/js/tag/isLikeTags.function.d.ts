import { StringTag, DomTag } from './Tag.class.js';
import { BaseSupport, Support } from './Support.class.js';
export declare function isLikeTags(support0: BaseSupport | Support | StringTag, // new
support1: Support | BaseSupport): boolean;
export declare function isLikeDomTags(tag0: DomTag, tag1: DomTag): boolean;
export declare function isLikeValueSets(values0: any[], values1: any[]): boolean;
