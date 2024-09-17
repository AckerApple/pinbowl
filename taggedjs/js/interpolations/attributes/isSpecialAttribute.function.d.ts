/** Looking for (class | style) followed by a period */
export declare function isSpecialAttr(attrName: string): boolean | "class" | "style";
export declare function isSpecialAction(attrName: string): false | "oninit" | "autofocus" | "autoselect";
