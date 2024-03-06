import { deepClone } from "./deepFunctions.js";
import { setUse } from "./setUse.function.js";
// TODO: rename
setUse.memory.providerConfig = {
    providers: [],
    //currentTagSupport: undefined as TagSupport | undefined,
    ownerTag: undefined,
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
            return existing.instance;
        }
        // Providers with provider requirements just need to use providers.create() and providers.inject()
        const instance = constructMethod.constructor ? new constructMethod() : constructMethod();
        const config = setUse.memory.providerConfig;
        config.providers.push({
            constructMethod,
            instance,
            clone: deepClone(instance)
        });
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
            ownerTag: config.ownerTag
        };
        while (owner.ownerTag) {
            const ownerProviders = owner.ownerTag.tagSupport.memory.providers;
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
            owner = owner.ownerTag; // cause reloop
        }
        const msg = `Could not inject provider: ${constructor.name} ${constructor}`;
        console.warn(`${msg}. Available providers`, config.providers);
        throw new Error(msg);
    }
};
setUse({
    beforeRender: (tagSupport, ownerTag) => {
        run(tagSupport, ownerTag);
    },
    beforeRedraw: (tagSupport, tag) => {
        run(tagSupport, tag.ownerTag);
    },
    afterRender: (tagSupport) => {
        const config = setUse.memory.providerConfig;
        tagSupport.memory.providers = [...config.providers];
        config.providers.length = 0;
    }
});
function run(tagSupport, ownerTag) {
    const config = setUse.memory.providerConfig;
    // config.currentTagSupport = tagSupport
    config.ownerTag = ownerTag;
    if (tagSupport.memory.providers.length) {
        config.providers.length = 0;
        config.providers.push(...tagSupport.memory.providers);
    }
}
//# sourceMappingURL=providers.js.map