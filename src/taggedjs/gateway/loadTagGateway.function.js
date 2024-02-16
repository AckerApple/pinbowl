import { initWebComponents } from "./gateway.web.component.js";
import { gatewayTagIds, getTagId } from "./tagGateway.utils.js";
let hasInitWebComponents = false;
export function loadTagGateway(component) {
    if (!hasInitWebComponents) {
        try {
            initWebComponents();
        }
        catch (err) {
            throw err;
        }
        hasInitWebComponents = true;
    }
    const id = getTagId(component);
    gatewayTagIds[id] = component;
    return id;
}
//# sourceMappingURL=loadTagGateway.function.js.map