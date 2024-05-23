import { deepClone } from '../deepFunctions';
import { setUse } from './setUse.function';
import { state } from './state.function';
setUse.memory.providerConfig = {
    providers: [],
    ownerSupport: undefined,
};
export const providers = {
    create: (constructMethod) => {
        const stateDiffMemory = state(() => ({ stateDiff: 0, provider: undefined }));
        // mimic how many states were called the first time
        if (stateDiffMemory.stateDiff) {
            for (let x = stateDiffMemory.stateDiff; x > 0; --x) {
                state(undefined);
            }
            const result = state(undefined);
            // stateDiffMemory.provider.constructMethod.compareTo = compareTo
            return result;
        }
        const result = state(() => {
            const memory = setUse.memory;
            const stateConfig = memory.stateConfig;
            const oldStateCount = stateConfig.array.length;
            // Providers with provider requirements just need to use providers.create() and providers.inject()
            const instance = 'prototype' in constructMethod ? new constructMethod() : constructMethod();
            const stateDiff = stateConfig.array.length - oldStateCount;
            const config = memory.providerConfig;
            const provider = {
                constructMethod,
                instance,
                clone: deepClone(instance),
                stateDiff,
            };
            stateDiffMemory.provider = provider;
            config.providers.push(provider);
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
            const config = setUse.memory.providerConfig;
            const cm = constructor;
            const compareTo = cm.compareTo = cm.compareTo || constructor.toString();
            let owner = {
                ownerTagSupport: config.ownerSupport
            };
            while (owner.ownerTagSupport) {
                const ownerProviders = owner.ownerTagSupport.global.providers;
                const provider = ownerProviders.find(provider => {
                    const constructorMatch = provider.constructMethod.compareTo === compareTo;
                    if (constructorMatch) {
                        return true;
                    }
                });
                if (provider) {
                    provider.clone = deepClone(provider.instance); // keep a copy of the latest before any change occur
                    config.providers.push(provider);
                    return provider.instance;
                }
                owner = owner.ownerTagSupport; // cause reloop checking next parent
            }
            const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
            console.warn(`${msg}. Available providers`, config.providers);
            throw new Error(msg);
        });
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