import * as vscode from 'vscode';
import { resolve } from 'path';
import { Type } from './defines';

export default class KeyTreeItem extends vscode.TreeItem {

    public name: string;
    public connectionName: string;
    public contextValue = 'key-tree-item';
    public type: Type;

    constructor(connection: string, key: string, type: Type) {
        super(key);
        this.name = key;
        this.connectionName = connection;
        this.type = type;
        super.tooltip = `${type} - ${key}`
    }

    public get iconPath() {
        switch (this.type) {
            case Type.STRING: return {
                dark: resolve(__dirname, '../resources/dark/string.svg'),
                light: resolve(__dirname, '../resources/light/string.svg'),
            };
            case Type.LIST: return {
                dark: resolve(__dirname, '../resources/dark/list.svg'),
                light: resolve(__dirname, '../resources/light/list.svg'),
            };
            case Type.SET: return {
                dark: resolve(__dirname, '../resources/dark/set.svg'),
                light: resolve(__dirname, '../resources/light/set.svg'),
            };
            case Type.ZSET: return {
                dark: resolve(__dirname, '../resources/dark/zset.svg'),
                light: resolve(__dirname, '../resources/light/zset.svg'),
            };
            case Type.HASH: return {
                dark: resolve(__dirname, '../resources/dark/hash.svg'),
                light: resolve(__dirname, '../resources/light/hash.svg'),
            };
            default: return;
        }
    }
}
