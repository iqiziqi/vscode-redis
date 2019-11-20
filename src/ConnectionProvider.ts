import { Event, EventEmitter, TreeDataProvider, TreeItem, workspace } from 'vscode';
import { IConfiguration } from './defines';
import Connection from './Connection';

export default class ConnectionProvider implements TreeDataProvider<TreeItem> {

    public connections: Map<string, Connection>;
    public connectionEvent: EventEmitter<TreeItem>;
    public onDidChangeTreeData: Event<TreeItem>;

    constructor() {
        this.connectionEvent = new EventEmitter();
        this.onDidChangeTreeData = this.connectionEvent.event;
        this.connections = new Map();
    }

    public getTreeItem(element: TreeItem): TreeItem {
        return element;
    }

    public getChildren(element?: TreeItem | undefined): TreeItem[] {
        return Array.from(this.connections.values());
    }

    public get configurations() {
        return workspace.getConfiguration().get<IConfiguration[]>('redis.connections') ?? [];
    }

    public connect(name: string) {
        const config = this.configurations.filter(c => c.name === name)[0];
        if (config) {
            this.connections.set(name, new Connection(config));
            this.connectionEvent.fire();
        }
    }

    public disconnect(name: string) {
        this.connections.delete(name);
        this.connectionEvent.fire();
    }
}
