import { Props } from '../Props.js';
import { AnySupport } from './Support.class.js';
export declare function clonePropsBy(support: AnySupport, props: Props, castProps?: Props): {
    latest: Props;
    castProps: Props | undefined;
} | undefined;
