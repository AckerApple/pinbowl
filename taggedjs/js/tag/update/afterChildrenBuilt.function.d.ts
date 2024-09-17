import { DomObjectChildren } from '../../interpolations/optimizers/ObjectNode.types.js';
import { AnySupport } from '../Support.class.js';
import { ContextItem } from '../Tag.class.js';
/** This is the function that enhances elements such as [class.something] and [style.color] OR it fixes elements that alter innerHTML */
export declare function afterChildrenBuilt(children: DomObjectChildren, // HTMLCollection // Element[],
subject: ContextItem, ownerSupport: AnySupport): void;
