import { GuildQueueEvent } from "discord-player";
import { EmbedBuilder } from "discord.js";
import { Customization } from "../../constants";
import { getServerInfoFooter } from "../../helpers/formatHelper";
import { getLocalization } from "../../helpers/localizationHelper";
import { IDiscordPlayerGuildQueueErrorHandler } from "../types/discordPlayerEventTypes";
import { getChannelByQueueMetadata, getLocaleByQueueMetadata } from "../../helpers/discordPlayerHelper";
import logger from "../../loggers/log4jsLogger";

export const errorEventHandlers: IDiscordPlayerGuildQueueErrorHandler[] = [
    {
        event: GuildQueueEvent.PlayerError,
        handler: async (queue, error) => {
            logger.error(error);

            const channel = getChannelByQueueMetadata(queue);
            const eventLocalization = getLocalization(getLocaleByQueueMetadata(queue)).events.music;
        
            const embed = new EmbedBuilder()
                .setColor(Customization.color.failure)
                .setTitle(eventLocalization.playbackError())
                .setDescription(formatErrorMessage(error))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.Error,
        handler: async (queue, error: Error) => {
            logger.error(error);

            const channel = getChannelByQueueMetadata(queue);
            const eventLocalization = getLocalization(getLocaleByQueueMetadata(queue)).events.music;
    
            const embed = new EmbedBuilder()
                .setColor(Customization.color.failure)
                .setTitle(eventLocalization.playerError())
                .setDescription(formatErrorMessage(error))
                .setFooter(getServerInfoFooter(channel.guild));
    
            await channel.send({ embeds: [embed] });
        },
    }
]

function formatErrorMessage(error: Error): string {
    const { name, message } = error as { name: string; message: string };
    return `${name} | ${message}`;
}