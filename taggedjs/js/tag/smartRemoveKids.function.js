import { destroyArray } from './checkDestroyPrevious.function.js';
import { elementDestroyCheck } from './elementDestroyCheck.function.js';
import { paint, paintRemoves } from './paint.function.js';
import { isPromise } from '../isInstance.js';
/** sets global.deleted on support and all children */
export function smartRemoveKids(support, promises, stagger) {
    const startStagger = stagger;
    const subject = support.subject;
    const thisGlobal = subject.global;
    const htmlDomMeta = thisGlobal.htmlDomMeta;
    const context = thisGlobal.context;
    thisGlobal.deleted = true;
    for (const subject of context) {
        if (subject.withinOwnerElement) {
            continue; // i live within my owner variable. I will be deleted with owner
        }
        const lastArray = subject.lastArray;
        if (lastArray) {
            destroyArray(subject, lastArray);
            continue;
        }
        // regular values, no placeholders
        const elm = subject.simpleValueElm;
        if (elm) {
            delete subject.simpleValueElm;
            paintRemoves.push(elm);
            continue;
        }
        const global = subject.global;
        if (global === undefined) {
            continue; // subject
        }
        if (global.deleted === true) {
            continue;
        }
        global.deleted = true;
        const oldest = global.oldest;
        if (oldest) {
            // recurse
            stagger = stagger + smartRemoveKids(oldest, promises, stagger);
            continue;
        }
    }
    destroyClones(htmlDomMeta, startStagger, promises);
    return stagger;
}
function destroyClones(oldClones, stagger, promises) {
    // check subjects that may have clones attached to them
    const newPromises = oldClones.map(clone => {
        const marker = clone.marker;
        if (marker) {
            paintRemoves.push(marker);
        }
        const dom = clone.domElement;
        if (!dom) {
            return;
        }
        return checkCloneRemoval(dom, stagger);
    }).filter(x => x); // only return promises
    if (newPromises.length) {
        promises.push(Promise.all(newPromises));
        return stagger;
    }
    return stagger;
}
/** Reviews elements for the presences of ondestroy */
function checkCloneRemoval(clone, stagger) {
    const customElm = clone;
    if (customElm.ondestroy) {
        const promise = elementDestroyCheck(customElm, stagger);
        if (isPromise(promise)) {
            return promise.then(() => {
                paintRemoves.push(clone);
                paint();
            });
        }
    }
    paintRemoves.push(clone);
}
//# sourceMappingURL=smartRemoveKids.function.js.map