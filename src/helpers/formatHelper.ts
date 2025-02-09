import { EmbedFooterOptions, Guild } from "discord.js";

export function getServerInfoFooter(guild: Guild): EmbedFooterOptions | null {
    return { 
        text: guild.name, 
        iconURL: getGuildIcon(guild)
    };
}

export function getGuildIcon(guild: Guild): string | undefined {
    return guild.iconURL() ?? undefined 
}