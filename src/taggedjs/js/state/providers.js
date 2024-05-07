import { deepClone } from '../deepFunctions';
import { setUse } from './setUse.function';
import { state } from './state.function';
setUse.memory.providerConfig = {
    providers: [],
    ownerSupport: undefined,
};
function get(constructMethod) {
    const config = setUse.memory.providerConfig;
    const providers = config.providers;
    return providers.find(provider => provider.constructMethod === constructMethod);
}
export const providers = {
    create: (constructMethod) => {
        const existing = get(constructMethod);
        if (existing) {
            existing.clone = deepClone(existing.instance);
            // fake calling state the same number of previous times
            for (let x = 0; x < existing.stateDiff; ++x) {
                state(existing.stateDiff);
            }
            return state(existing.stateDiff);
        }
        const oldStateCount = setUse.memory.stateConfig.array.length;
        // Providers with provider requirements just need to use providers.create() and providers.inject()
        const instance = 'prototype' in constructMethod ? new constructMethod() : constructMethod();
        const stateDiff = setUse.memory.stateConfig.array.length - oldStateCount;
        const config = setUse.memory.providerConfig;
        config.providers.push({
            constructMethod,
            instance,
            clone: deepClone(instance),
            stateDiff,
        });
        state(() => instance); // tie provider to a state for rendering change checking
        return instance;
    },
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    inject: (constructor) => {
        const oldValue = get(constructor);
        if (oldValue) {
            return oldValue.instance;
        }
        const config = setUse.memory.providerConfig;
        let owner = {
            ownerTagSupport: config.ownerSupport
        };
        while (owner.ownerTagSupport) {
            const ownerProviders = owner.ownerTagSupport.global.providers;
            const provider = ownerProviders.find(provider => {
                if (provider.constructMethod === constructor) {
                    return true;
                }
            });
            if (provider) {
                provider.clone = deepClone(provider.instance); // keep a copy of the latest before any change occur
                config.providers.push(provider);
                return provider.instance;
            }
            owner = owner.ownerTagSupport; // cause reloop
        }
        const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
        console.warn(`${msg}. Available providers`, config.providers);
        throw new Error(msg);
    }
};
setUse({
    beforeRender: (tagSupport, ownerSupport) => {
        run(tagSupport, ownerSupport);
    },
    beforeRedraw: (tagSupport, newTagSupport) => {
        run(tagSupport, newTagSupport.ownerTagSupport);
    },
    afterRender: (tagSupport) => {
        const config = setUse.memory.providerConfig;
        tagSupport.global.providers = [...config.providers];
        config.providers.length = 0;
    }
});
function run(tagSupport, ownerSupport) {
    const config = setUse.memory.providerConfig;
    config.ownerSupport = ownerSupport;
    if (tagSupport.global.providers.length) {
        config.providers.length = 0;
        config.providers.push(...tagSupport.global.providers);
    }
}
//# sourceMappingURL=providers.js.map