import * as vscode from 'vscode';
import { IConfiguration } from './defines';
import Connection from './Connection';

export default class ConnectionProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

    public connections: Map<string, Connection>;
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

    public getChildren(element?: vscode.TreeItem | undefined): vscode.TreeItem[] {
        return Array.from(this.connections.values());
    }

    public get configurations() {
        return vscode.workspace.getConfiguration().get<IConfiguration[]>('redis.connections') ?? [];
    }

    public connect(name: string) {
        const config = this.configurations.filter(c => c.name === name)[0];
        if (config) {
            this.connections.set(name, new Connection(config));
            this.connectionEvent.fire();
        }
    }

    public disconnect(name: string) {
        this.connections.get(name)?.disconnect;
        this.connections.delete(name);
        this.connectionEvent.fire();
    }
}
