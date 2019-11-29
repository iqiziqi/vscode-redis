export enum ConnectionStatus {
    Connected,
    Connecting,
    Disconnected,
}

export enum Type {
    STRING = 'string',
    LIST = 'list',
    SET = 'set',
    ZSET = 'zset',
    HASH = 'hash',
}

export interface IConfiguration {
    name: string;
    host: string;
    port: number;
}
