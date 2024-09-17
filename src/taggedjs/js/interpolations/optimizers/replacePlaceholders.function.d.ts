import { ValuePos } from "./LikeObjectElement.type.js";
import { ParsedHtml, UnparsedHtml } from "./types.js";
export declare function replacePlaceholders(dom: UnparsedHtml, valueCount: number, valuePositions?: ValuePos[], currentTail?: (string | number)[]): ParsedHtml;
