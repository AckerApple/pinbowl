import { handleProviderChanges } from './handleProviderChanges.function.js';
export function providersChangeCheck(support) {
    const global = support.subject.global;
    const providers = global.providers;
    if (!providers) {
        return [];
    }
    const prosWithChanges = [];
    // reset clones
    for (const provider of providers) {
        const owner = provider.owner;
        const hasChange = handleProviderChanges(owner, provider);
        prosWithChanges.push(...hasChange.map(x => x.support));
    }
    return prosWithChanges;
}
//# sourceMappingURL=providersChangeCheck.function.js.map