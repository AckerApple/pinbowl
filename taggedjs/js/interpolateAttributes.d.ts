import { Context, Tag } from "./Tag.class";
export type HowToSet = (element: Element, name: string, value: string) => any;
export declare function interpolateAttributes(child: Element, scope: Context, ownerTag: Tag): void;
