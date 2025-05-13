import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    Guild,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { Command } from "../command";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper";
import { isUserNotInVoiceChannel, getGuildMember, getGuildId, getGuildMemberLocale, getGuild } from "../../helpers/interactionHelper";
import { PlayerState } from "../../music/musicPlayer";
import { DiscordPlayer } from "../../music/discordPlayer";
import { getServerInfoFooter } from "../../helpers/formatHelper";
import { Customization } from "../../constants";
import { getTrackDescription, getTrackMetadataFields, getTrackThumbnail } from "../../helpers/discordPlayerHelper";
import { Track } from "discord-player";
import { L } from "../../localizations/i18n/i18n-node";

const defaultCommandLocalization = getDefaultLocalization().music.pause;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('music.pause.description'))
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	async execute(interaction: ChatInputCommandInteraction) {
        const musicLocalization = getLocalization(getGuildMemberLocale(interaction)).music;

        await interaction.deferReply();

        const member = getGuildMember(interaction);
        if (isUserNotInVoiceChannel(member)) {
            await interaction.followUp({ 
                content: musicLocalization.when.userIsNotInVoiceChannel(), 
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;

        const state = await musicPlayer.pause(interaction);
        switch(state) {
            case PlayerState.PlayingInAnotherChannel:
                await interaction.followUp({
                    content: musicLocalization.when.userIsNotInSameVoiceChannelAsBot(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.QueueDoesNotExist | PlayerState.QueueIsEmpty:
                await interaction.followUp({ 
                    content: musicLocalization.when.queueDoesNotExist(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            case PlayerState.Paused:
                await sendTrackEmbed(interaction, musicPlayer, state);

                await interaction.deleteReply();
                break;
            case PlayerState.Resumed:
                await sendTrackEmbed(interaction, musicPlayer, state);

                await interaction.deleteReply();
                break;
            default:
                await interaction.deleteReply();
                break;
        }
	}
} satisfies Command;

async function sendTrackEmbed(
    interaction: ChatInputCommandInteraction,
    musicPlayer: DiscordPlayer,
    state: PlayerState
): Promise<void> {
    const guildId = getGuildId(interaction);
    const currentTrack = musicPlayer.getCurrentTrack(guildId)!;
    const currentQueue = musicPlayer.getCurrentQueue(guildId)!;

    const localization = getLocalization(currentQueue!.metadata.locale);
    const commandLocalization = localization.music.pause;

    const title = state === PlayerState.Paused 
        ? commandLocalization.when.paused() 
        : commandLocalization.when.resumed();

    const embed = createTrackEmbed(
        title,
        currentTrack,
        localization,
        getGuild(interaction)
    );

    await currentQueue.metadata.channel.send({ embeds: [embed] });
}

function createTrackEmbed(
    title: string,
    currentTrack: Partial<Track>,
    localization: typeof L[keyof typeof L],
    guild: Guild
): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(Customization.color.playerNotification)
        .setTitle(title)
        .setDescription(getTrackDescription(currentTrack))
        .setFields(getTrackMetadataFields(currentTrack, { 
            duration: localization.events.music.duration(), 
            author: localization.events.music.author()
        }))
        .setThumbnail(getTrackThumbnail(currentTrack))
        .setFooter(getServerInfoFooter(guild));
}