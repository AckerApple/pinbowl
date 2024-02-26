export declare function elementDestroyCheck<T>(nextSibling: Element & {
    ondestroy?: (event: Event) => T;
}, stagger: number): T | undefined;
