import * as vscode from 'vscode';
import { resolve } from 'path';
import { RedisClient } from 'redis';
import { IConfiguration, ConnectionStatus } from './defines';

export default class Connection extends vscode.TreeItem {

    private client: RedisClient | null;

    public readonly name: string;
    public readonly host: string;
    public readonly port: number;

    public status: number;

    constructor(config: IConfiguration) {
        super(config.name);
        super.iconPath = {
            dark: resolve(__dirname, '../resources/dark/database.svg'),
            light: resolve(__dirname, '../resources/light/database.svg'),
        };

        this.client = null;
        this.name = config.name;
        this.host = config.host;
        this.port = config.port;
        this.status = ConnectionStatus.Disconnected;
    }
}
