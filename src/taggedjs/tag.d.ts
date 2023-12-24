import { Tag } from "./Tag.class.js";
export type Props = unknown;
export type Wrapper = () => Tag;
export declare class TemplaterResult {
    props: Props;
    newProps: Props;
    cloneProps: Props;
    tagged: boolean;
    wrapper: Wrapper;
    newest?: Tag;
    oldest?: Tag;
    redraw?: () => Tag | undefined;
}
type TagResult = (props: Props, // props or children
children?: Tag) => Tag;
export declare function tag<T>(tagComponent: T | TagResult): T;
export {};
