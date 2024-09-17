import { AnySupport, BaseSupport, Support, SupportContextItem } from '../Support.class.js';
import { Props } from '../../Props.js';
export declare function updateExistingTagComponent(ownerSupport: BaseSupport | Support, support: AnySupport, // lastest
subject: SupportContextItem): void;
export declare function syncFunctionProps(newSupport: AnySupport, lastSupport: AnySupport, ownerSupport: BaseSupport | Support, newPropsArray: unknown[], // templater.props
maxDepth: number, depth?: number): Props;
export declare function moveProviders(lastSupport: Support, newSupport: AnySupport): void;
