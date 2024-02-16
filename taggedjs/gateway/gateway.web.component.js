import { checkByElement, destroyGateway } from "./tagGateway.utils.js";
/** <tag-element id="" props="json-string" />
 * For Angular @NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]}) is required
 */
export class TagElement extends HTMLElement {
    gateway;
    constructor() {
        super();
        // attributes are not available right away
        setTimeout(() => this.gateway = checkByElement(this), 0);
    }
    disconnectedCallback() {
        destroyGateway(this.gateway);
    }
}
/** Call me one time */
export function initWebComponents() {
    customElements.define('tag-element', TagElement);
}
//# sourceMappingURL=gateway.web.component.js.map