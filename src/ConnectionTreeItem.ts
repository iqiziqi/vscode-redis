import * as vscode from 'vscode';
import * as IORedis from 'ioredis';
import { resolve } from 'path';
import { IConfiguration } from './defines';

export default class ConnectionTreeItem extends vscode.TreeItem {

    public name: string;
    public contextValue = 'connection-tree-item';
    public iconPath = {
        dark: resolve(__dirname, '../resources/dark/database.svg'),
        light: resolve(__dirname, '../resources/light/database.svg'),
    };
    public collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    public client: IORedis.Redis;

    constructor(config: IConfiguration) {
        super(config.name);
        this.name = config.name;
        this.client = new IORedis({
            host: config.host,
            port: config.port,
            lazyConnect: true,
            connectTimeout: 3000,
            reconnectOnError: () => false,
        });
    }
}
