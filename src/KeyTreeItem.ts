import * as vscode from 'vscode';

export default class KeyTreeItem extends vscode.TreeItem {

    public contextValue = 'key-tree-item';

    constructor(key: string) {
        super(key);
    }
}
