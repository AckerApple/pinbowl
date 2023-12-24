export declare const interpolateReplace: RegExp;
/** replaces ${x} with <template id="x-start"></template><template id="x-end"></template> */
export declare function interpolateToTemplates(template: string): {
    string: string;
    keys: string[];
};
