import * as vscode from 'vscode';
import { resolve } from 'path';

export default class KeyTreeItem extends vscode.TreeItem {

    public name: string;
    public connectionName: string;
    public contextValue = 'key-tree-item';
    public type: string;

    constructor(connection: string, key: string, type: string) {
        super(key);
        this.name = key;
        this.connectionName = connection;
        this.type = type;
    }

    public get iconPath() {
        switch (this.type) {
            case 'string': return {
                dark: resolve(__dirname, '../resources/dark/string.svg'),
                light: resolve(__dirname, '../resources/light/string.svg'),
            };
            case 'set':
            case 'zset':
            case 'list': return {
                dark: resolve(__dirname, '../resources/dark/list.svg'),
                light: resolve(__dirname, '../resources/light/list.svg'),
            };
            case 'hash': return {
                dark: resolve(__dirname, '../resources/dark/hash.svg'),
                light: resolve(__dirname, '../resources/light/hash.svg'),
            };
            default: return;
        }
    }
}
