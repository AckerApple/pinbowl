export interface ElementTargetEvent extends Event {
    target: HTMLElement;
}
export interface InputElementTargetEvent extends Event {
    target: HTMLElement;
    value: string | null;
}
