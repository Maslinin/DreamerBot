import { BaseGuildTextChannel, Client, EmbedBuilder, Events } from "discord.js";
import { getLocalization } from "../helpers/localizationHelper";
import { getServerInfoFooter } from "../helpers/formatHelper";

export default (client: Client): void => {
    client.on(Events.GuildMemberRemove, async mbr => {
        const channelId = client.config.channels?.userLeft;
        if (!channelId) {
            console.warn('The Channel\'s Id is empty. Please fill the config.');
            return;
        }

        if (mbr.user.bot) {
            console.info(`The member ${mbr.user.tag} is a bot, ignoring.`);
            return;
        }

        const locale = getLocalization(mbr.guild.preferredLocale);

        const embed = new EmbedBuilder()
            .setTitle(locale.events.userLeft.notificationTitle({ 
                userName: mbr.displayName 
            }))
            .setFooter(getServerInfoFooter(mbr.guild))
            .setTimestamp();

        const channel = mbr.guild?.channels.cache.get(channelId) as BaseGuildTextChannel;
        await channel.send({ embeds: [embed] });
    });
};