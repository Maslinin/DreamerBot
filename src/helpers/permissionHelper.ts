import { PermissionsBitField } from "discord.js";

export function hasPermissions(userPermissions: PermissionsBitField, requiredPermissions: bigint): boolean {
    const permissionField = new PermissionsBitField(requiredPermissions);
    return userPermissions.has(permissionField);
}