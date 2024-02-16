import { Props } from "./Props.js";
import { TagComponent } from "./templater.utils.js";
export type dispatchEvent = (name: string, eventData: EventData) => void;
export type GatewayProps = Props & {
    [key: string]: unknown;
    dispatchEvent: dispatchEvent;
};
export declare function checkGateways(): void;
export declare const tagGateway: (component: TagComponent) => {
    id: string;
};
export type EventData = {
    detail: Record<string, any>;
};
