import { GuildQueue, Track } from "discord-player";
import { TextChannel, Locale } from "discord.js";

export function getChannelByQueueMetadata(queue: GuildQueue): TextChannel {
    return (queue.metadata as { channel: TextChannel }).channel;
}

export function getLocaleByQueueMetadata(queue: GuildQueue): Locale {
    return (queue.metadata as { locale: Locale }).locale;
}

export function getTrackDescription(track: Partial<Track>) {
    return `[${track.title}](${track.url})`;
}

export function getTrackMetadataFields(track: Partial<Track>, fields: { duration: string, author: string }) {
    return [ 
        { name: fields.duration, value: track.duration!, inline: true },
        { name: fields.author, value: track.author!, inline: true } 
    ];
}

export function getTrackThumbnail(track: Partial<Track>): string | null{
    return track.thumbnail ?? null;
}