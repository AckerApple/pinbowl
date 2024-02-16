import { redrawTag } from "./redrawTag.function.js";
import { tagElement } from "./tagElement.js";
export function checkGateways() {
    Object.entries(gateways).forEach(([id, gateway]) => checkGateway(gateway));
}
function checkGateway(gateway) {
    const { id, observer, tag } = gateway;
    if (document.getElementById(id)) {
        return true;
    }
    observer.disconnect();
    tag.destroy();
    delete gateways[id];
    return false;
}
const namedTimeouts = {};
export const tagGateway = function tagGateway(component) {
    const componentString = functionToHtmlId(component);
    const id = '__tagTemplate_' + componentString;
    if (namedTimeouts[id]) {
        return namedTimeouts[id];
    }
    let intervalId;
    let hitCount = 0;
    const interval = 5;
    function findElements() {
        const elements = document.querySelectorAll('#' + id);
        if (!elements.length) {
            return elements.length;
        }
        // Element has been found, load
        if (intervalId) {
            clearInterval(intervalId);
        }
        delete namedTimeouts[id];
        elements.forEach(element => {
            const updateTag = element.updateTag;
            if (updateTag) {
                updateTag();
                return;
            }
            const props = parsePropsString(element);
            try {
                const { tag } = tagElement(component, element, props);
                watchElement(id, element, tag);
            }
            catch (err) {
                console.warn('Failed to render component to element', { component, element, props });
                throw err;
            }
        });
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
function parsePropsString(element) {
    const propsString = element.getAttribute('props');
    if (!propsString) {
        return { element };
    }
    try {
        const props = JSON.parse(propsString);
        // props.element = element
        props.dispatchEvent = function (name, eventData) {
            const event = new CustomEvent(name, eventData);
            element.dispatchEvent(event);
        };
        return props;
    }
    catch (err) {
        console.warn('Failed to parse props on element', { element, propsString });
        throw err;
    }
}
function watchElement(id, targetNode, tag) {
    let lastTag = tag;
    const observer = new MutationObserver((mutationsList, observer) => {
        if (!checkGateway(gateway)) {
            return;
        }
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                updateTag();
            }
        }
    });
    function updateTag() {
        const templater = tag.tagSupport.templater;
        const oldProps = templater.tagSupport.props;
        templater.tagSupport.props = parsePropsString(targetNode);
        const isSameProps = JSON.stringify(oldProps) === JSON.stringify(templater.tagSupport.props);
        if (isSameProps) {
            return; // no reason to update, same props
        }
        templater.tagSupport.latestProps = templater.tagSupport.props;
        const result = redrawTag(lastTag, templater);
        // update records
        gateway.tag = lastTag = result.retag;
    }
    ;
    targetNode.updateTag = updateTag;
    const gateway = { id, tag, observer };
    gateways[id] = gateway;
    // Configure the observer to watch for changes in child nodes and attributes
    const config = { attributes: true };
    // Start observing the target node for specified changes
    observer.observe(targetNode, config);
}
function functionToHtmlId(func) {
    // Convert function to string
    let funcString = func.toString();
    // Remove spaces and replace special characters with underscores
    let cleanedString = funcString.replace(/\s+/g, '_')
        .replace(/[^\w\d]/g, '_');
    // Ensure the ID starts with a letter
    if (!/^[a-zA-Z]/.test(cleanedString)) {
        cleanedString = 'fn_' + cleanedString;
    }
    return cleanedString;
}
const gateways = {};
//# sourceMappingURL=tagGateway.function.js.map