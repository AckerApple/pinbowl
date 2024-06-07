import { deepClone } from '../deepFunctions.js';
import { setUse } from './setUse.function.js';
import { state } from './state.function.js';
export const providers = {
    create: (constructMethod) => {
        const stateDiffMemory = state(() => ({ stateDiff: 0, provider: undefined }));
        // mimic how many states were called the first time
        if (stateDiffMemory.stateDiff) {
            for (let x = stateDiffMemory.stateDiff; x > 0; --x) {
                state(undefined);
            }
            const result = state(undefined);
            return result;
        }
        const result = state(() => {
            const memory = setUse.memory;
            const stateConfig = memory.stateConfig;
            const oldStateCount = stateConfig.array.length;
            // Providers with provider requirements just need to use providers.create() and providers.inject()
            const instance = 'prototype' in constructMethod ? new constructMethod() : constructMethod();
            const tagSupport = stateConfig.tagSupport;
            const stateDiff = stateConfig.array.length - oldStateCount;
            const provider = {
                constructMethod,
                instance,
                clone: deepClone(instance),
                stateDiff,
                owner: tagSupport,
                children: [],
            };
            stateDiffMemory.provider = provider;
            tagSupport.global.providers.push(provider);
            stateDiffMemory.stateDiff = stateDiff;
            return instance;
        });
        const cm = constructMethod;
        // const compareTo = cm.compareTo = cm.compareTo || cm.toString()
        const compareTo = cm.compareTo = cm.toString();
        stateDiffMemory.provider.constructMethod.compareTo = compareTo;
        return result;
    },
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor) => {
        // find once, return same every time after
        return state(() => {
            const memory = setUse.memory;
            const cm = constructor;
            const compareTo = cm.compareTo = cm.compareTo || constructor.toString();
            const tagSupport = memory.stateConfig.tagSupport;
            const providers = [];
            let owner = {
                ownerTagSupport: tagSupport.ownerTagSupport
            };
            while (owner.ownerTagSupport) {
                const ownerProviders = owner.ownerTagSupport.global.providers;
                const provider = ownerProviders.find(provider => {
                    providers.push(provider);
                    const constructorMatch = provider.constructMethod.compareTo === compareTo;
                    if (constructorMatch) {
                        return true;
                    }
                });
                if (provider) {
                    provider.clone = deepClone(provider.instance); // keep a copy of the latest before any change occur
                    const tagSupport = memory.stateConfig.tagSupport;
                    tagSupport.global.providers.push(provider);
                    provider.children.push(tagSupport);
                    return provider.instance;
                }
                owner = owner.ownerTagSupport; // cause reloop checking next parent
            }
            const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
            console.warn(`${msg}. Available providers`, providers);
            throw new Error(msg);
        });
    }
};
//# sourceMappingURL=providers.js.map