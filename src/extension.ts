import * as vscode from 'vscode';
import ConnectionProvider from './ConnectionProvider';
import { IConfiguration } from './defines';

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
        async (connection) => {
            const name = connection?.name ??
                await vscode.window.showQuickPick(Array.from(connectionProvider.connections.keys()));
            if (!name) return;
            connectionProvider.disconnect(name);
        },
    );

    context.subscriptions.push(connectCommand);
    context.subscriptions.push(disconnectCommand);
}

export function deactivate() {}
