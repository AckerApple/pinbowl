import { AnySupport } from '../Support.class.js';
import { Props } from '../../Props.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
export declare function isInlineHtml(templater: TemplaterResult): boolean;
/** Main function used by all other callers to render/update display of a tag component */
export declare function renderSupport<T extends AnySupport>(support: T): T;
export declare function renderInlineHtml(ownerSupport: AnySupport, support: AnySupport): AnySupport;
export declare function checkRenderUp(ownerSupport: AnySupport, templater: TemplaterResult, support: AnySupport): boolean;
export declare function hasPropLengthsChanged(nowProps: Props, latestProps: Props): boolean;
