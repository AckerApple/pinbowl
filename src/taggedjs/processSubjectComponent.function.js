import { getTagSupport } from "./getTagSupport.js";
import { runBeforeRedraw, runBeforeRender } from "./tagRunner.js";
import { setUse } from "./setUse.function.js";
import { processTagResult } from "./processTagResult.function.js";
export function processSubjectComponent(value, result, template, ownerTag, options) {
    const anyValue = value;
    if (anyValue.tagged !== true) {
        let name = anyValue.name || anyValue.constructor?.name;
        if (name === 'Function') {
            name = undefined;
        }
        const label = name || anyValue.toString().substring(0, 120);
        const error = new Error(`Not a tag component. Wrap your function with tag(). Example tag(props => html\`\`) on component:\n\n${label}\n\n`);
        throw error;
    }
    const templater = value;
    const tagSupport = result.tagSupport || getTagSupport(ownerTag.tagSupport.depth + 1, templater);
    tagSupport.mutatingRender = () => {
        // Is this NOT my first render
        if (result.tag) {
            const exit = tagSupport.renderExistingTag(result.tag, templater);
            if (exit) {
                return;
            }
        }
        // draw to my parent
        const newest = tagSupport.newest = ownerTag.tagSupport.render();
        return newest;
    };
    let tag = templater.newest;
    const providers = setUse.memory.providerConfig;
    providers.ownerTag = ownerTag;
    let isFirstTime = !tag;
    runBeforeRender(tagSupport, tag);
    if (options.forceElement) {
        isFirstTime = true;
        const oldTag = tag;
        // only true when options.forceElement
        if (oldTag) {
            runBeforeRedraw(oldTag.tagSupport, oldTag);
        }
    }
    if (isFirstTime) {
        tag = templater.forceRenderTemplate(tagSupport, ownerTag);
    }
    ownerTag.children.push(tag);
    tag.setSupport(tagSupport);
    const clones = processTagResult(tag, result, // The element set here will be removed from document. Also result.tag will be added in here
    template, // <template end interpolate /> (will be removed)
    options);
    return clones;
}
//# sourceMappingURL=processSubjectComponent.function.js.map