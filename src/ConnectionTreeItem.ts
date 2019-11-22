import * as vscode from 'vscode';
import { resolve } from 'path';

export default class ConnectionTreeItem extends vscode.TreeItem {

    public contextValue = 'connection-tree-item';
    public iconPath = {
        dark: resolve(__dirname, '../resources/dark/database.svg'),
        light: resolve(__dirname, '../resources/light/database.svg'),
    };
    public collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;

    constructor(name: string) {
        super(name);
    }
}
