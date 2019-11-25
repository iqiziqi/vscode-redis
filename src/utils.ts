import * as vscode from 'vscode';
import { IConfiguration } from './defines';

function config() {
    return vscode.workspace.getConfiguration();
}

export const outputChannel = vscode.window.createOutputChannel('Redis');

export function getConnections() {
    return config().get<IConfiguration[]>('redis.connections') ?? [];
}
