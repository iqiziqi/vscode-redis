import * as vscode from 'vscode';
import ConnectionTreeItem from './ConnectionTreeItem';
import KeyTreeItem from './KeyTreeItem';
import { IConfiguration } from './defines';

export default class ConnectionProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public connections: Map<string, ConnectionTreeItem>;
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
                return Array.from(this.connections.values());
            case element instanceof ConnectionTreeItem:
                const keys = await this.connections.get(element!.label!)?.client?.keys('*');
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
            vscode.window.showErrorMessage(`Can't find this connection.`);
            return;
        }
        const item = new ConnectionTreeItem(config);
        try {
            await item.client.connect();
            this.connections.set(name, item);
            this.connectionEvent.fire();
        } catch (e) {
            await item.client.quit();
            await vscode.window.showErrorMessage(`Can't connect to ${name}`, 'Ok');
        }
    }

    public disconnect(name: string) {
        this.connections.get(name)?.client?.disconnect();
        this.connections.delete(name);
        this.connectionEvent.fire();
    }

    public refreshKeys(name: string) {
        const item = this.connections.get(name);
        if (item) {
            this.connectionEvent.fire(item);
        }
    }
}
