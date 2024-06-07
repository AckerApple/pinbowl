export type OnInitCallback = () => unknown;
/** runs a callback function one time and never again. Same as calling state(() => ...) */
export declare function onInit(callback: OnInitCallback): void;
