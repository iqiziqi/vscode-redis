import * as vscode from 'vscode';
import * as Redis from 'ioredis';
import { resolve } from 'path';
import { IConfiguration } from './defines';

export default class Connection extends vscode.TreeItem {

    public readonly name: string;
    public readonly client: Redis.Redis;

    constructor(config: IConfiguration) {
        super(config.name);
        super.iconPath = {
            dark: resolve(__dirname, '../resources/dark/database.svg'),
            light: resolve(__dirname, '../resources/light/database.svg'),
        };

        this.name = config.name;
        this.client = new Redis({
            host: config.host,
            port: config.port,
            lazyConnect: true,
            connectTimeout: 1000,
            reconnectOnError: () => false,
        });
    }
}
