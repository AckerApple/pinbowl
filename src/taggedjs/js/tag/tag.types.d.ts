import { ValueSubject } from '../subject/index.js';
import { DomTag, StringTag } from './Tag.class.js';
export declare class RouteQuery {
    get(_name: string): string | undefined;
}
export type RouteProps = {
    param: string;
    paramSubject: ValueSubject<string>;
    query: RouteQuery;
};
export type ToTag = ((...props: any[]) => StateToTag | StringTag | DomTag | null) & {
    arrayValue?: unknown;
};
export type StateToTag = () => StringTag | DomTag | null;
export type RouteTag = (extraProps?: Record<string, any>) => StringTag | DomTag;
