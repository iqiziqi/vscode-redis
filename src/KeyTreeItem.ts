import * as vscode from 'vscode';

export default class KeyTreeItem extends vscode.TreeItem {

    constructor(key: string) {
        super(key);
    }
}
