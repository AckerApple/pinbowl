import { InputElementTargetEvent } from '../interpolations/attributes/ElementTargetEvent.interface.js';
import { LikeObjectChildren } from '../interpolations/optimizers/LikeObjectElement.type.js';
import { RegularValue } from './update/processRegularValue.function.js';
export type TagValues = (((e: InputElementTargetEvent) => any) | RegularValue | null | undefined | object)[];
export declare function html(strings: string[] | TemplateStringsArray, ...values: TagValues): import("./Tag.class.js").StringTag;
export declare namespace html {
    var dom: (dom: LikeObjectChildren, ...values: TagValues) => import("./Tag.class.js").DomTag;
}
