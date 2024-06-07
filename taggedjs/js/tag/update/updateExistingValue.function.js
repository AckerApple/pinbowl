import { TagSupport } from '../TagSupport.class.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
import { isTagClass, isTagTemplater } from '../../isInstance.js';
import { processTagArray } from './processTagArray.js';
import { updateExistingTagComponent } from './updateExistingTagComponent.function.js';
import { processRegularValue } from './processRegularValue.function.js';
import { checkDestroyPrevious, restoreTagMarker } from '../checkDestroyPrevious.function.js';
import { processSubjectComponent } from './processSubjectComponent.function.js';
import { isLikeTags } from '../isLikeTags.function.js';
import { getFakeTemplater, processTag, setupNewSupport } from './processTag.function.js';
import { swapInsertBefore } from '../setTagPlaceholder.function.js';
import { ValueTypes } from '../ValueTypes.enum.js';
import { getValueType } from '../getValueType.function.js';
export function updateExistingValue(subject, value, ownerSupport, insertBefore) {
    const subjectTag = subject;
    const valueType = getValueType(value);
    checkDestroyPrevious(subject, value, insertBefore, valueType);
    // handle already seen tag components
    if (valueType === ValueTypes.tagComponent) {
        return prepareUpdateToComponent(value, subjectTag, insertBefore, ownerSupport);
    }
    // was component but no longer
    const tagSupport = subjectTag.tagSupport;
    if (tagSupport) {
        if (valueType === ValueTypes.function) {
            return subjectTag; // its a oneRender tag
        }
        handleStillTag(subject, value, ownerSupport);
        return subjectTag;
    }
    switch (valueType) {
        case ValueTypes.tagArray:
            processTagArray(subject, value, insertBefore, // oldInsertBefore as InsertBefore,
            ownerSupport, { counts: {
                    added: 0,
                    removed: 0,
                } });
            return subject;
        case ValueTypes.templater:
            processTag(value, insertBefore, ownerSupport, subjectTag);
            return subjectTag;
        case ValueTypes.tag:
            const tag = value;
            let templater = tag.templater;
            if (!templater) {
                templater = getFakeTemplater();
                tag.templater = templater;
                templater.tag = tag;
            }
            processTag(templater, insertBefore, ownerSupport, subjectTag);
            return subjectTag;
        case ValueTypes.subject:
            return value;
        // now its a useless function (we don't automatically call functions)
        case ValueTypes.function:
            if (!subject.clone) {
                subject.clone = swapInsertBefore(insertBefore);
            }
            return subject;
    }
    // This will cause all other values to render
    processRegularValue(value, subject, insertBefore);
    return subjectTag;
}
function handleStillTag(subject, value, ownerSupport) {
    const lastSupport = subject.tagSupport;
    let templater = value;
    const isClass = isTagClass(value);
    if (isClass) {
        const tag = value;
        templater = tag.templater;
        if (!templater) {
            templater = new TemplaterResult([]);
            templater.tag = tag;
            tag.templater = templater;
        }
    }
    const valueSupport = new TagSupport(templater, ownerSupport, subject);
    // ??? new
    // subject.tagSupport = valueSupport
    if (isClass) {
        valueSupport.global = lastSupport.global;
    }
    const isSameTag = value && isLikeTags(lastSupport, valueSupport);
    if (isTagTemplater(value)) {
        setupNewSupport(valueSupport, ownerSupport, subject);
    }
    if (isSameTag) {
        lastSupport.updateBy(valueSupport);
        return;
    }
    if (isSameTag) {
        // const subjectTag = subject as TagSubject
        const global = lastSupport.global;
        const insertBefore = global.insertBefore;
        return processTag(templater, insertBefore, ownerSupport, subject);
    }
    return processRegularValue(value, subject, subject.insertBefore);
}
function prepareUpdateToComponent(templater, subjectTag, insertBefore, ownerSupport) {
    // When last value was not a component
    if (!subjectTag.tagSupport) {
        processSubjectComponent(templater, subjectTag, insertBefore, // oldInsertBefore as InsertBefore,
        ownerSupport, {
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    const tagSupport = new TagSupport(templater, ownerSupport, subjectTag);
    const subjectSup = subjectTag.tagSupport;
    const prevSupport = subjectSup.global.newest;
    if (prevSupport) {
        const newestState = prevSupport.memory.state;
        tagSupport.memory.state.length = 0;
        tagSupport.memory.state.push(...newestState);
    }
    else {
        restoreTagMarker(subjectSup);
        processSubjectComponent(templater, subjectTag, insertBefore, ownerSupport, {
            counts: { added: 0, removed: 0 },
        });
        return subjectTag;
    }
    tagSupport.global = subjectSup.global;
    subjectTag.tagSupport = tagSupport;
    updateExistingTagComponent(ownerSupport, tagSupport, // latest value
    subjectTag, insertBefore);
    return subjectTag;
}
//# sourceMappingURL=updateExistingValue.function.js.map