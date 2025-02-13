import { GuildQueue, GuildQueueEvent, PlayerEvent } from "discord-player";
import { IDiscordPlayerDebugHandler, IDiscordPlayerGuildQueueDebugHandler } from "../types/discordPlayerEventTypes";
import { IQueueMetadata } from "../types/discordPlayerMetadataTypes";

export const debugEventHandlers: IDiscordPlayerDebugHandler[] = [
    {
        event: PlayerEvent.Debug,
        handler: async (message: string) => {
            console.log(`[PLAYER DEBUG] General player debug event: ${message}`);
        },
    }
];

export const debugQueueEventHandlers: IDiscordPlayerGuildQueueDebugHandler[] = [
    {
        event: GuildQueueEvent.Debug,
        handler: async (queue: GuildQueue<IQueueMetadata>, message: string) => {
            console.log(`[QUEUE DEBUG] Player queue debug event: ${message}`);
        },
    }
];