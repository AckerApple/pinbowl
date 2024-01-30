import { deepClone } from "./deepFunctions.js";
import { setUse } from "./tagRunner.js";
export const config = {
    providers: [],
    currentTag: undefined,
    ownerTag: undefined,
};
function get(constructMethod) {
    return config.providers.find(provider => provider.constructMethod === constructMethod);
}
export const providers = {
    /**
     * @template T
     * @param {(new (...args: any[]) => T) | () => T} constructor
     * @returns {T}
     */
    create: (constructMethod) => {
        const existing = get(constructMethod);
        if (existing) {
            existing.clone = deepClone(existing.instance);
            return existing.instance;
        }
        // Providers with provider requirements just need to use providers.create() and providers.inject()
        const instance = constructMethod.constructor ? new constructMethod() : constructMethod();
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
        let owner = {
            ownerTag: config.ownerTag
        };
        while (owner.ownerTag) {
            const ownerProviders = owner.ownerTag.providers;
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
        const msg = `Could not inject provider: ${constructor}`;
        console.warn(`${msg}. Available providers`, config.providers);
        throw new Error(msg);
    }
};
setUse({
    beforeRedraw: (_tagSupport, tag) => {
        config.currentTag = tag;
        config.ownerTag = tag.ownerTag;
        if (tag.providers.length) {
            config.providers.length = 0;
            config.providers.push(...tag.providers);
        }
    },
    afterRender: (_tagSupport, tag) => {
        tag.providers = [...config.providers];
        config.providers.length = 0;
    }
});
//# sourceMappingURL=providers.js.map