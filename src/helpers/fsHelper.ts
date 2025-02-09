import fs from 'node:fs';
import path from 'node:path';
import { FileExtension } from '../constants';

export async function getModules(directory: string): Promise<any[]> {
    const files = await getFiles(directory, FileExtension.modules, true);
    return await Promise.all(files.map(async f => await import(f)));
}

export async function getFiles(directory: string, extensions: string[], recursive: boolean = false) {
    const files = await fs.promises.readdir(path.resolve(directory), { recursive: recursive, withFileTypes: true });
    return files
        .filter(f => extensions.includes(path.extname(f.name)))
        .map(f => path.join(f.parentPath, f.name));
}

export async function getDirectories(sourcePath: string, recursive: boolean = false): Promise<string[]> {
    const directories = await fs.promises.readdir(sourcePath, { recursive: recursive, withFileTypes: true });
    return directories
        .filter(d => d.isDirectory())
        .map(d => path.join(sourcePath, d.name));
}