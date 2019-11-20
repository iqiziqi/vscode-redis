export enum ConnectionStatus {
    Connected,
    Connecting,
    Disconnected,
}

export interface IConfiguration {
    name: string;
    host: string;
    port: number;
}
