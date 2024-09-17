import { getSupportInCycle } from '../tag/getSupportInCycle.function.js';
import { setUseMemory } from './setUse.function.js';
import { state } from './state.function.js';
export const providers = {
    create: (constructMethod) => {
        const stateDiffMemory = state(() => ({ stateDiff: 0, provider: undefined }));
        // mimic how many states were called the first time
        if (stateDiffMemory.stateDiff) {
            let x = stateDiffMemory.stateDiff;
            while (x--) {
                state(undefined);
            }
            const result = state(undefined);
            return result;
        }
        const result = state(() => {
            const stateConfig = setUseMemory.stateConfig;
            const oldStateCount = stateConfig.array.length;
            // Providers with provider requirements just need to use providers.create() and providers.inject()
            const instance = constructMethod.prototype ? new constructMethod() : constructMethod();
            const support = stateConfig.support;
            const stateDiff = stateConfig.array.length - oldStateCount;
            const provider = {
                constructMethod,
                instance,
                stateDiff,
                owner: support,
                children: [],
            };
            stateDiffMemory.provider = provider;
            const global = support.subject.global;
            const providers = global.providers = global.providers || [];
            providers.push(provider);
            stateDiffMemory.stateDiff = stateDiff;
            return instance;
        });
        const cm = constructMethod;
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
            // const memory = setUse.memory
            const cm = constructor;
            const compareTo = cm.compareTo = cm.compareTo || constructor.toString();
            const support = getSupportInCycle(); // memory.stateConfig.support as Support
            const providers = [];
            let owner = {
                ownerSupport: support.ownerSupport
            };
            while (owner.ownerSupport) {
                const ownGlobal = owner.ownerSupport.subject.global;
                const ownerProviders = ownGlobal.providers;
                if (!ownerProviders) {
                    owner = owner.ownerSupport; // cause reloop checking next parent
                    continue;
                }
                const provider = ownerProviders.find(provider => {
                    providers.push(provider);
                    const constructorMatch = provider.constructMethod.compareTo === compareTo;
                    if (constructorMatch) {
                        return true;
                    }
                });
                if (provider) {
                    const global = support.subject.global;
                    const providers = global.providers = global.providers || [];
                    providers.push(provider);
                    provider.children.push(support);
                    return provider.instance;
                }
                owner = owner.ownerSupport; // cause reloop checking next parent
            }
            const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
            console.warn(`${msg}. Available providers`, providers);
            throw new Error(msg);
        });
    }
};
//# sourceMappingURL=providers.js.map