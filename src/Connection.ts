import * as vscode from 'vscode';
import { resolve } from 'path';
import { RedisClient } from 'redis';
import { IConfiguration } from './defines';

export default class Connection extends vscode.TreeItem {

    private client: RedisClient | null;

    public readonly name: string;
    public readonly host: string;
    public readonly port: number;

    constructor(config: IConfiguration) {
        super(config.name);
        super.iconPath = {
            dark: resolve(__dirname, '../resources/dark/database.svg'),
            light: resolve(__dirname, '../resources/light/database.svg'),
        };

        this.name = config.name;
        this.host = config.host;
        this.port = config.port;
        this.client = new RedisClient({
            host: this.host,
            port: this.port,
        });
    }

    public disconnect() {
        this.client?.quit();
        this.client = null;
    }
}
