import { checkElement, getTagId } from "./tagGateway.utils.js";
const namedTimeouts = {};
export const tagGateway = function tagGateway(component) {
    const id = getTagId(component);
    if (namedTimeouts[id]) {
        return namedTimeouts[id];
    }
    let intervalId;
    let hitCount = 0;
    const interval = 5;
    function findElements() {
        const elements = checkTagElementsById(id, component);
        if (!elements.length) {
            return elements.length;
        }
        // Element has been found, load
        if (intervalId) {
            clearInterval(intervalId);
        }
        delete namedTimeouts[id];
        return elements.length;
    }
    function findElement() {
        intervalId = setInterval(() => {
            hitCount = hitCount + interval;
            if (hitCount >= 2000) {
                clearInterval(intervalId);
                throw new Error(`TaggedJs Element ${id} not found`);
            }
            findElements();
        }, interval);
    }
    const elementCounts = findElements();
    if (elementCounts) {
        return { id };
    }
    findElement();
    namedTimeouts[id] = { id };
    return namedTimeouts[id];
};
function checkTagElementsById(id, component) {
    const elements = document.querySelectorAll('#' + id);
    return checkTagElements(id, elements, component);
}
function checkTagElements(id, elements, component) {
    elements.forEach(element => checkElement(id, element, component));
    return elements;
}
//# sourceMappingURL=tagGateway.function.js.map