import { GuildQueueEvent } from "discord-player";
import { EmbedBuilder } from "discord.js";
import { Customization } from "../../constants";
import { getServerInfoFooter } from "../../helpers/formatHelper";
import { getLocalization } from "../../helpers/localizationHelper";
import { IDiscordPlayerErrorHandler } from "../types/discordMusicPlayerEventTypes";
import { getChannelByQueueMetadata, getLocaleByQueueMetadata } from "../../helpers/discordMusicPlayerHelper";

export const errorEventHandlers: IDiscordPlayerErrorHandler[] = [
    {
        event: GuildQueueEvent.PlayerError,
        handler: async (queue, error) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue)).events.music;
        
            const embed = new EmbedBuilder()
                .setColor(Customization.color.failure)
                .setTitle(localization.playbackError())
                .setDescription(formatErrorMessage(error))
                .setFooter(getServerInfoFooter(channel.guild));

            await channel.send({ embeds: [embed] });
        },
    },
    {
        event: GuildQueueEvent.Error,
        handler: async (queue, error: Error) => {
            const channel = getChannelByQueueMetadata(queue);
            const localization = getLocalization(getLocaleByQueueMetadata(queue)).events.music;
    
            const embed = new EmbedBuilder()
                .setColor(Customization.color.failure)
                .setTitle(localization.playerError())
                .setDescription(formatErrorMessage(error))
                .setFooter(getServerInfoFooter(channel.guild));
    
            await channel.send({ embeds: [embed] });
        },
    }
]

function formatErrorMessage(error: Error): string {
    const { name, cause } = error as { name: string; cause: string };
    return `${name} | ${cause}`;
}