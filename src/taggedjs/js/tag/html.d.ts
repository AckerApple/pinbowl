import { InputElementTargetEvent } from '../interpolations/ElementTargetEvent.interface.js';
import { RegularValue } from '../subject.types.js';
import { Tag } from './Tag.class.js';
export type TagValues = (((e: InputElementTargetEvent) => any) | RegularValue | null | undefined | Object)[];
export declare function html(strings: string[] | TemplateStringsArray, ...values: TagValues): Tag;
