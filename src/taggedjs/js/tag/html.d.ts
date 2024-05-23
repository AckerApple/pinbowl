import { InputElementTargetEvent } from "../interpolations/ElementTargetEvent.interface";
import { RegularValue } from "../subject.types";
import { Tag } from "./Tag.class";
export type TagValues = (((e: InputElementTargetEvent) => any) | RegularValue | null | undefined | Object)[];
export declare function html(strings: string[] | TemplateStringsArray, ...values: TagValues): Tag;
