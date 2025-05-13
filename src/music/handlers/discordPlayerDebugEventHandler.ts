import { GuildQueue, GuildQueueEvent, PlayerEvent } from "discord-player";
import { IDiscordPlayerDebugHandler, IDiscordPlayerGuildQueueDebugHandler } from "../types/discordPlayerEventTypes";
import { IQueueMetadata } from "../types/discordPlayerMetadataTypes";
import { logger } from "../../loggers";

export const debugEventHandlers: IDiscordPlayerDebugHandler[] = [
    {
        event: PlayerEvent.Debug,
        handler: async (message: string) => {
            logger.debug('[PLAYER DEBUG] General player debug event: %s', message);
        },
    }
];

export const debugQueueEventHandlers: IDiscordPlayerGuildQueueDebugHandler[] = [
    {
        event: GuildQueueEvent.Debug,
        handler: async (queue: GuildQueue<IQueueMetadata>, message: string) => {
            logger.debug('[QUEUE DEBUG] Player queue debug event: %s', message);
        },
    }
];