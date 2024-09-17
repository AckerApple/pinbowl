import { Support } from '../tag/Support.class.js';
import { Provider } from './providers.js';
export declare function handleProviderChanges(appSupport: Support, provider: Provider): TagWithProvider[];
type TagWithProvider = {
    support: Support;
    renderCount: number;
    provider: Provider;
};
export {};
