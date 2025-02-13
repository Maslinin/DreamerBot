import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    SlashCommandBuilder 
} from "discord.js";
import { Command } from "../command";
import { getLocalization, generateLocalizations, getDefaultLocalization } from "../../helpers/localizationHelper";
import { isUserNotInVoiceChannel, getGuildMember, getGuildMemberLocale } from "../../helpers/interactionHelper";
import { DiscordPlayer } from "../../music/discordPlayer";
import { PlayerState } from "../../music/musicPlayer";
import { MusicPlayerSettings } from "../../constants";

const defaultCommandLocalization = getDefaultLocalization().music.play;

export default {
	data: new SlashCommandBuilder()
        .setName(defaultCommandLocalization.name())
        .setDescription(defaultCommandLocalization.description())
        .setDescriptionLocalizations(generateLocalizations('music.play.description'))
        .addStringOption(option => 
            option
                .setName(defaultCommandLocalization.options.query.name())
                .setNameLocalizations(generateLocalizations('music.play.options.query.name'))
                .setDescription(defaultCommandLocalization.options.query.description())
                .setDescriptionLocalizations(generateLocalizations('music.play.options.query.description'))
                .setAutocomplete(true)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.Connect),
	async execute(interaction: ChatInputCommandInteraction) {
        const musicLocalization = getLocalization(getGuildMemberLocale(interaction)).music;
        const commandLocalization = musicLocalization.play;

        const member = getGuildMember(interaction);
        if (isUserNotInVoiceChannel(member)) {
            await interaction.followUp({ 
                content: musicLocalization.when.userIsNotInVoiceChannel(), 
                flags: MessageFlags.Ephemeral
            });
            return;
        }

		const query = interaction.options.getString(musicLocalization.play.options.query.name(), true);

        const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;

        const searchResult = await musicPlayer.search(query);
        if (!searchResult) {
            await interaction.followUp({
                content: commandLocalization.when.noTrackSearchResult({ query }),
                flags: MessageFlags.Ephemeral
            });
            return;
        }

        const state = await musicPlayer.play(interaction, searchResult[0]);
        switch(state) {
            case PlayerState.PlayingInAnotherChannel:
                await interaction.followUp({
                    content: musicLocalization.when.userIsNotInSameVoiceChannelAsBot(),
                    flags: MessageFlags.Ephemeral
                });
                break;
            default:
                await interaction.deleteReply();
                break;
        }
	},
    async autocomplete(interaction: AutocompleteInteraction) {
        const commandLocalization = getLocalization(getGuildMemberLocale(interaction)).music.play;
        const query = interaction.options.getString(commandLocalization.options.query.name(), true);

        if (!query) {
            return await interaction.respond([]);
        }

        const musicPlayer = interaction.client.musicPlayer as DiscordPlayer;
        
        const searchResult = await musicPlayer.search(query);
        if (!searchResult) {
            return await interaction.respond([]);
        }

        return await interaction.respond(
            searchResult
                .slice(0, MusicPlayerSettings.maxTracksToSearch)
                .map(t => ({
                    name: formatTrackName(t),
                    value: t.url
                }))
        );
    }
} satisfies Command;

function formatTrackName(track: { title: string; author: string; duration: string }): string {
    const shortenedTitle = track.title.length > 50 ? track.title.slice(0, 50) + "..." : track.title;
    return `${shortenedTitle} - ${track.author} | ${track.duration}`;
}