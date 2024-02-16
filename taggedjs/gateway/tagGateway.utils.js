import { redrawTag, tagElement } from "../index.js";
import { loadTagGateway } from "./loadTagGateway.function.js";
const gateways = {};
export const gatewayTagIds = {};
export function checkAllGateways() {
    Object.entries(gateways).forEach(([id, gateways]) => checkGateways(gateways));
}
export function checkGateways(gateways) {
    gateways.forEach(gateway => checkGateway(gateway));
}
function checkGateway(gateway) {
    const { element } = gateway;
    if (document.body.contains(element)) {
        return; // its still good, do not continue to destroy
    }
    destroyGateway(gateway);
    return false;
}
export function destroyGateway(gateway) {
    const { id, observer, tag } = gateway;
    observer.disconnect();
    tag.destroy();
    delete gateways[id];
}
export function getTagId(component) {
    const componentString = functionToHtmlId(component);
    return '__tagTemplate_' + componentString;
}
function parsePropsString(element) {
    const propsString = element.getAttribute('props');
    if (!propsString) {
        return { element };
    }
    try {
        const props = JSON.parse(propsString);
        // attribute eventProps as output bindings
        const eventPropsString = element.getAttribute('events');
        if (eventPropsString) {
            eventPropsString.split(',').map(x => x.trim()).map((name) => {
                props[name] = (value) => dispatchEvent(name, { detail: { [name]: value } });
            });
        }
        const dispatchEvent = function (name, eventData) {
            const event = new CustomEvent(name, eventData);
            element.dispatchEvent(event);
        };
        // props.dispatchEvent = dispatchEvent
        return props;
    }
    catch (err) {
        console.warn('Failed to parse props on element', { element, propsString });
        throw err;
    }
}
/** adds to gateways[id].push */
function watchElement(id, targetNode, tag, component) {
    let lastTag = tag;
    const observer = new MutationObserver(mutationsList => {
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
        const newProps = parsePropsString(targetNode);
        templater.tagSupport.props = newProps;
        const isSameProps = JSON.stringify(oldProps) === JSON.stringify(newProps);
        if (isSameProps) {
            return; // no reason to update, same props
        }
        templater.tagSupport.latestProps = newProps;
        const result = redrawTag(lastTag, templater);
        // update records
        gateway.tag = lastTag = result.retag;
    }
    loadTagGateway(component);
    const gateway = {
        id, tag, observer, component, element: targetNode, updateTag,
    };
    gateways[id] = gateways[id] || [];
    gateways[id].push(gateway);
    targetNode.gateway = gateway;
    // Configure the observer to watch for changes in child nodes and attributes
    const config = { attributes: true };
    // Start observing the target node for specified changes
    observer.observe(targetNode, config);
    return gateway;
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
export function checkByElement(element) {
    const id = element.id || element.getAttribute('id');
    if (!id) {
        const message = 'Cannot check a tag on element with no id attribute';
        console.warn(message, { id, element });
        throw new Error(message);
    }
    const component = gatewayTagIds[id];
    if (!component) {
        const message = `Cannot find a tag registered by id of ${id}`;
        console.warn(message, { id, element });
        throw new Error(message);
    }
    return checkElement(id, element, component);
}
export function checkElement(id, element, component) {
    const gateway = element.gateway;
    if (gateway) {
        gateway.updateTag();
        return gateway;
    }
    const props = parsePropsString(element);
    try {
        const { tag } = tagElement(component, element, props);
        // watch element AND add to gateways[id].push()
        return watchElement(id, element, tag, component);
    }
    catch (err) {
        console.warn('Failed to render component to element', { component, element, props });
        throw err;
    }
}
//# sourceMappingURL=tagGateway.utils.js.map