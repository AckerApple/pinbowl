import { AnySupport, BaseSupport, Support, SupportContextItem } from '../Support.class.js';
/** TODO: This seems to support both new and updates and should be separated? */
export declare function renderWithSupport(newSupport: Support | BaseSupport, lastSupport: Support | BaseSupport | undefined, // previous
subject: SupportContextItem, // events & memory
ownerSupport?: BaseSupport | Support): {
    support: AnySupport;
    wasLikeTags: boolean;
};
