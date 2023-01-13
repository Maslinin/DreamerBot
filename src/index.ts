import { EmbedBuilder, Events, TextBasedChannel } from "discord.js";
import { botToken, channelIDs } from "./config.json";
import { isCommand } from "./commands/command";
import { embedBorderColor } from "./constants";
import cmdFactory from "./commands/commandFactory";
import globalContext from "./globalContext";

const client = globalContext.discordClient;

try {
    client.on(Events.MessageCreate || Events.MessageUpdate, async msg => {
        if (msg.author.bot || !msg.inGuild()) {
            return;
        }
        
        if (!isCommand(msg)) {
            return;
        }
    
        const cmd = cmdFactory.getCommand(msg);
        if (cmd) {
            await cmd.execute(msg);
        } 
        else {
            await msg.channel.send(globalContext.locale.commandDoesNotExistMessage);
        }
    })
    .on(Events.GuildMemberAdd, async mbr => {
        const channel = mbr.guild.channels.cache.get(`${channelIDs.welcomeChannelId}`) as TextBasedChannel;
        channel.send(`${globalContext.locale.welcomeMessageText} ${mbr.guild.name}!`);

        const embed = new EmbedBuilder;
        embed.setAuthor( { name: `${mbr.user.tag}`, iconURL: `${mbr.user.avatarURL()}` } )
        .setColor(embedBorderColor)
        .setDescription(`<@${mbr.user.id}> ${globalContext.locale.userJoinedServerText}`)
        .setFooter( { text: mbr.guild.name, iconURL: `${mbr.guild.iconURL()}` } )
        .setThumbnail(mbr.user.avatarURL())

        channel.send({ embeds: [embed] });
        channel.send(`${globalContext.locale.localBotInfoText}`);
    });
}
catch(err) {
    console.log((err as Error).stack);
}

client.login(botToken);