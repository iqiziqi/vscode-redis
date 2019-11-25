import * as vscode from 'vscode';

export default class KeyTreeItem extends vscode.TreeItem {

    public name: string;
    public connection: string;
    public contextValue = 'key-tree-item';

    constructor(connection: string, key: string) {
        super(key);
        this.name = key;
        this.connection = connection;
    }
}
