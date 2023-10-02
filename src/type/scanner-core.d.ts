export enum analyserType {
    AXE = "axe",
    CODE_SNIFFER = "code-sniffer",
    CSS = "css"
}

export type BullConfig = {
    processorName: analyserType | string; // Name of the bull processor.
    enabled: boolean; // True to enable bull for this app.
    root: string; // The root url of the redis database.
    port: number; // The port of the redis database.
};