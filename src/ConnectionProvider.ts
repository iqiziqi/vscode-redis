import * as vscode from 'vscode';
import ConnectionTreeItem from './ConnectionTreeItem';
import KeyTreeItem from './KeyTreeItem';
import { getConnections } from './utils';
import { Type } from './defines';

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
                return this.connectionList;
            case element instanceof ConnectionTreeItem:
                const connectionName = (element as ConnectionTreeItem).name;
                const connection = this.connections.get(element!.label!);
                const keys = await connection?.client?.keys('*');
                const promises = keys?.map(async key => {
                    const type = await connection?.client?.type(key) ?? '';
                    return new KeyTreeItem(connectionName, key, type as Type);
                }) ?? [];
                return await Promise.all(promises);
            default:
                return [];
        }
    }

    public get connectionList () {
        return Array.from(this.connections.values());
    }

    public get connectionNameList() {
        return Array.from(this.connections.keys());
    }

    public async connect(name: string) {
        const config = getConnections().filter(c => c.name === name)[0];
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

    public async getValue(connectionName: string, key: string, type: string) {
        const item = this.connections.get(connectionName);
        if (!item) return;
        const value =
            type === Type.STRING ? await item.client.get(key):
            type === Type.LIST   ? await item.client.lrange(key, 0, -1):
            type === Type.SET    ? await item.client.smembers(key):
            type === Type.ZSET   ? await item.client.zrange(key, 0, -1):
            type === Type.HASH   ? await item.client.hgetall(key):
            undefined;
        return JSON.stringify(value, null, 2);
    }

    public async setKey(connection: string, key: string, value: string) {
        const item = this.connections.get(connection);
        if (item) {
            await item.client.set(key, value);
            this.connectionEvent.fire(item);
        }
    }

    public async deleteKey(connection: string, key: string) {
        const item = this.connections.get(connection);
        if (item) {
            await item.client.del(key);
            this.connectionEvent.fire(item);
        }
    }

    public async keys(name: string) {
        return await this.connections.get(name)?.client.keys('*');
    }
}
