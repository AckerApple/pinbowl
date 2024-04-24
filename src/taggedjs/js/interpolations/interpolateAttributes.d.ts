import { Context } from "../Tag.class";
import { TagSupport } from "../TagSupport.class";
export type HowToSet = (element: Element, name: string, value: string) => any;
export declare function interpolateAttributes(child: Element, scope: Context, ownerSupport: TagSupport): void;
