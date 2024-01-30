import { variablePrefix } from "./Tag.class.js";
import { isSubjectInstance, isTagComponent, isTagInstance } from "./isInstance.js";
import { getTagSupport } from "./getTagSupport.js";
import { config as providers } from "./providers.js";
import { elementInitCheck } from "./elementInitCheck.js";
import { processTagArray } from "./processTagArray.js";
import { runBeforeRender } from "./tagRunner.js";
export function interpolateTemplate(template, // <template end interpolate /> (will be removed)
context, // variable scope of {`__tagVar${index}`:'x'}
ownerTag, // Tag class
counts, // {added:0, removed:0}
{ forceElement }) {
    if (!template.hasAttribute('end')) {
        return; // only care about starts
    }
    const variableName = template.getAttribute('id');
    if (variableName?.substring(0, variablePrefix.length) !== variablePrefix) {
        return; // ignore, not a tagVar
    }
    const result = context[variableName];
    const isSubject = isSubjectInstance(result);
    /*if(forceElement && isSubject) {
      result = result.value
      isSubject = false
    }*/
    // TODO: Need to just check if it can be subscribed to
    if (isSubject) {
        const callback = (templateNewValue) => {
            processSubjectValue(templateNewValue, result, template, ownerTag, { counts, forceElement });
            setTimeout(() => {
                counts.added = 0; // reset
                counts.removed = 0; // reset
            }, 0);
        };
        const sub = result.subscribe(callback);
        ownerTag.cloneSubs.push(sub);
        /*if(forceElement) {
          callback(result.value)
        }*/
        return;
    }
    const before = template.clone || template;
    const clone = updateBetweenTemplates(result, before);
    ownerTag.clones.push(clone);
    template.clone = clone;
    return;
}
function processSubjectValue(value, result, // could be tag via result.tag
template, // <template end interpolate /> (will be removed)
ownerTag, options) {
    if (isTagInstance(value)) {
        // first time seeing this tag?
        if (!value.tagSupport) {
            value.tagSupport = getTagSupport(ownerTag.tagSupport.depth + 1);
            value.tagSupport.mutatingRender = ownerTag.tagSupport.mutatingRender;
            value.tagSupport.oldest = value.tagSupport.oldest || value;
            ownerTag.children.push(value);
            value.ownerTag = ownerTag;
        }
        processTagResult(value, result, // Function will attach result.tag
        template, options);
        return;
    }
    // *for map
    const isArray = value instanceof Array && value.every(x => isTagInstance(x));
    if (isArray) {
        return processTagArray(result, value, template, ownerTag, options);
    }
    if (isTagComponent(value)) {
        return processSubjectComponent(value, result, template, ownerTag, options);
    }
    // *if processing WAS a tag BUT NOW its some other non-tag value
    if (result.tag) {
        // put the template back
        const lastFirstChild = template.clone || template; // result.tag.clones[0] // template.lastFirstChild
        lastFirstChild.parentNode.insertBefore(template, lastFirstChild);
        const stagger = options.counts.removed;
        const tag = result.tag;
        const animated = tag.destroy({ stagger });
        options.counts.removed = stagger + animated;
        delete result.tag;
        const clone = updateBetweenTemplates(value, lastFirstChild // ✅ this will be removed
        ); // the template will be remove in here
        template.clone = clone;
        return;
    }
    const before = template.clone || template; // Either the template is on the doc OR its the first element we last put on doc
    // Processing of regular values
    const clone = updateBetweenTemplates(value, before);
    template.clone = clone;
    const oldPos = ownerTag.clones.indexOf(before);
    if (oldPos >= 0 && !ownerTag.clones.includes(clone) && !before.parentNode) {
        ownerTag.clones.splice(oldPos, 1);
        ownerTag.clones.push(clone);
    }
}
// Function to update the value of x
export function updateBetweenTemplates(value, lastFirstChild) {
    const parent = lastFirstChild.parentNode;
    // mimic React skipping to display EXCEPT for true does display on page
    if (value === undefined || value === false || value === null) { // || value === true
        value = '';
    }
    // Insert the new value (never use innerHTML here)
    const textNode = document.createTextNode(value); // never innerHTML
    parent.insertBefore(textNode, lastFirstChild);
    /* remove existing nodes */
    parent.removeChild(lastFirstChild);
    if (lastFirstChild.nodeName === 'TEMPLATE') {
        lastFirstChild.setAttribute('removeAt', Date.now().toString());
    }
    return textNode;
}
/** Returns {clones:[], subs:[]} */
export function processTagResult(tag, result, // used for recording past and current value
insertBefore, // <template end interpolate />
{ index, counts, forceElement, }) {
    // *for
    if (index !== undefined) {
        const existing = result.lastArray[index];
        if (existing?.tag.isLikeTag(tag)) {
            existing.tag.updateByTag(tag);
            return;
        }
        const lastFirstChild = insertBefore; // tag.clones[0] // insertBefore.lastFirstChild
        tag.buildBeforeElement(lastFirstChild, { counts, forceElement, depth: tag.tagSupport.depth + 1 });
        result.lastArray.push({
            tag, index
        });
        return;
    }
    // *if appears we already have seen
    if (result.tag && !forceElement) {
        // are we just updating an if we already had?
        if (result.tag.isLikeTag(tag)) {
            // components
            if (result instanceof Function) {
                const newTag = result(result.tag.tagSupport);
                result.tag.updateByTag(newTag);
                return;
            }
            result.tag.updateByTag(tag);
            return;
        }
    }
    // *if just now appearing to be a Tag
    const before = insertBefore.clone || insertBefore;
    tag.buildBeforeElement(before, { counts, forceElement, depth: tag.tagSupport.depth });
    result.tag = tag; // let reprocessing know we saw this previously as an if
    return;
}
function processSubjectComponent(value, result, template, ownerTag, options) {
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
    providers.ownerTag = ownerTag;
    const isFirstTime = !tag;
    runBeforeRender(tagSupport, tag);
    if (isFirstTime) {
        tag = templater.forceRenderTemplate(tagSupport, ownerTag);
    }
    ownerTag.children.push(tag);
    tag.setSupport(tagSupport);
    processTagResult(tag, result, // The element set here will be removed from document. Also result.tag will be added in here
    template, // <template end interpolate /> (will be removed)
    options);
    return;
}
export function afterElmBuild(elm, options) {
    if (!elm.getAttribute) {
        return;
    }
    if (!options.forceElement) {
        elementInitCheck(elm, options.counts);
    }
    if (elm.children) {
        new Array(...elm.children).forEach(child => afterElmBuild(child, options));
    }
}
//# sourceMappingURL=interpolateTemplate.js.map