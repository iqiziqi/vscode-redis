import * as vscode from 'vscode';
import ConnectionProvider from './ConnectionProvider';
import KeyTreeItem from './KeyTreeItem';
import ConnectionTreeItem from './ConnectionTreeItem';
import { IConfiguration } from './defines';
import { outputChannel } from './utils';

export function activate(context: vscode.ExtensionContext) {

    const connectionProvider = new ConnectionProvider();
    vscode.window.registerTreeDataProvider('redis-explorer', connectionProvider);

    const connectCommand = vscode.commands.registerCommand(
        'redis.connect',
        async () => {
            const configs = vscode.workspace.getConfiguration().get<IConfiguration[]>('redis.connections') || [];
            const names = configs?.map(c => ({ label: c.name }));
            const name = await vscode.window.showQuickPick(names);
            if (!name) return;
            await connectionProvider.connect(name.label);
        },
    );

    const disconnectCommand = vscode.commands.registerCommand(
        'redis.disconnect',
        async (connection: ConnectionTreeItem) => {
            const name = connection?.label ??
                await vscode.window.showQuickPick(Array.from(connectionProvider.connections.keys()));
            if (!name) return;
            connectionProvider.disconnect(name);
        },
    );

    const refreshKeysCommand = vscode.commands.registerCommand(
        'redis.refreshKeys',
        (connection: ConnectionTreeItem) => {
            connectionProvider.refreshKeys(connection.name);
        },
    );

    const setKeyCommand = vscode.commands.registerCommand(
        'redis.setKey',
        async (connection: ConnectionTreeItem) => {
            const connectionName = connection?.name ??
                await vscode.window.showQuickPick(Array.from(connectionProvider.connections.keys()));
            if (!connectionName) return;
            const key = await vscode.window.showInputBox();
            if (!key) return;
            const value = await vscode.window.showInputBox();
            if (!value) return;
            connectionProvider.setKey(connectionName, key, value);
        },
    )

    const deleteKeyCommand = vscode.commands.registerCommand(
        'redis.deleteKey',
        async (key: KeyTreeItem) => {
            if (key) {
                connectionProvider.deleteKey(key.connectionName, key.name);
                return;
            }
            const connection = await vscode.window.showQuickPick(connectionProvider.connectionNameList);
            if (!connection) return;
            const keys = await connectionProvider.keys(connection) ?? [];
            const name = await vscode.window.showQuickPick(keys);
            if (!name) return;
            connectionProvider.deleteKey(connection, name);
        },
    );

    const getValueCommand = vscode.commands.registerCommand(
        'redis.getValue',
        async (key: KeyTreeItem) => {
            if (!key) return;
            const value = await connectionProvider.getValue(key.connectionName, key.name, key.type);
            outputChannel.appendLine(`Output:\n${value}\n`);
            outputChannel.show();
        },
    );

    context.subscriptions.push(connectCommand);
    context.subscriptions.push(disconnectCommand);
    context.subscriptions.push(refreshKeysCommand);
    context.subscriptions.push(setKeyCommand);
    context.subscriptions.push(deleteKeyCommand);
    context.subscriptions.push(getValueCommand);
}

export function deactivate() {}
