type PaintAppend = {
    element: Text | Element;
    relative: Text | Element;
};
export declare let paintRemoves: (Text | Element | ChildNode)[];
export declare let paintContent: (() => any)[];
export declare let setContent: [string, Text][];
export declare let paintAppends: PaintAppend[];
export declare let paintInsertBefores: PaintAppend[];
export declare let paintAfters: (() => any)[];
export declare const painting: {
    locks: number;
};
export declare function paint(): void;
export {};
