import { deepClone, deepEqual } from '../deepFunctions.js';
import { handleProviderChanges } from './handleProviderChanges.function.js';
export function providersChangeCheck(tagSupport) {
    const global = tagSupport.global;
    const providersWithChanges = global.providers.filter(provider => !deepEqual(provider.instance, provider.clone));
    // reset clones
    for (let index = providersWithChanges.length - 1; index >= 0; --index) {
        const provider = providersWithChanges[index];
        const owner = provider.owner;
        handleProviderChanges(owner, provider);
        provider.clone = deepClone(provider.instance);
    }
}
//# sourceMappingURL=providersChangeCheck.function.js.map