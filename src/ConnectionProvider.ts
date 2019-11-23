import * as vscode from 'vscode';
import * as IORedis from 'ioredis';
import ConnectionTreeItem from './ConnectionTreeItem';
import KeyTreeItem from './KeyTreeItem';
import { IConfiguration } from './defines';

export default class ConnectionProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public connections: Map<string, IORedis.Redis>;
    public connectionEvent: vscode.EventEmitter<vscode.TreeItem>;
    public onDidChangeTreeData: vscode.Event<vscode.TreeItem>;

    constructor() {
        this.connectionEvent = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.connectionEvent.event;
        this.connections = new Map();
    }

    public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    public async getChildren(element?: vscode.TreeItem | undefined): Promise<vscode.TreeItem[]> {
        switch (true) {
            case element === undefined:
                const names = Array.from(this.connections.keys());
                return names.map(name => new ConnectionTreeItem(name));
            case element instanceof ConnectionTreeItem:
                const keys = await this.connections.get(element!.label!)?.keys('*');
                return keys?.map(key => new KeyTreeItem(key)) ?? [];
            default:
                return [];
        }
    }

    public get configurations() {
        return vscode.workspace.getConfiguration().get<IConfiguration[]>('redis.connections') ?? [];
    }

    public async connect(name: string) {
        const config = this.configurations.filter(c => c.name === name)[0];
        if (!config) {
            vscode.window.showErrorMessage('Can not find this connection.');
        }
        try {
            const client = new IORedis({
                host: config.host,
                port: config.port,
                lazyConnect: true,
                connectTimeout: 1000,
                reconnectOnError: () => false,
            });
            await client.connect();
            this.connections.set(name, client);
            this.connectionEvent.fire();
        } catch (e) {
            await vscode.window.showErrorMessage(e.message, 'Ok');
        }
    }

    public disconnect(name: string) {
        this.connections.get(name)?.disconnect();
        this.connections.delete(name);
        this.connectionEvent.fire();
    }

    public refreshKeys(name: string) {
        this.connectionEvent.fire();
    }
}
