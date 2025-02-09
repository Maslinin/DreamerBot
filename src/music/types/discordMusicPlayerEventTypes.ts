import { GuildQueue, GuildQueueEvent, Track } from "discord-player";
import { IQueueMetadata } from "./discordMusicPlayerMetadataTypes";

export interface IDiscordPlayerEventHandler {
    event: GuildQueueEvent;
}

export interface IDiscordPlayerTrackEventHandler extends IDiscordPlayerEventHandler {
    handler: (queue: GuildQueue<IQueueMetadata>, track: Track) => Promise<void>;
}

export interface IDiscordPlayerErrorHandler extends IDiscordPlayerEventHandler {
    handler: (queue: GuildQueue<IQueueMetadata>, error: Error) => Promise<void>;
}