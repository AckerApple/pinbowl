import { ParsedHtml } from "./types.js";
export declare function htmlInterpolationToDomMeta(strings: string[], values: unknown[]): ParsedHtml;
export declare function htmlInterpolationToPlaceholders(strings: string[], values: unknown[]): string[];
export declare function parseHTML(html: string): ParsedHtml;
export declare function balanceArrayByArrays(results: unknown[], strings: string[], values: unknown[]): void;
