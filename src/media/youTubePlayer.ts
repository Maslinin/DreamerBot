import { Client, EmbedBuilder, GuildTextBasedChannel, Message } from "discord.js";
import { DisTube, Events, RepeatMode } from "distube";
import { getCommandParams } from "../commands/command";
import IMediaPlayer from "./mediaPlayer";

export default class YouTubePlayer implements IMediaPlayer {
    private readonly _distube: DisTube;
    private readonly _locale: any;

    private readonly _searchSongs: number = 5;
    private readonly _emptyColldownInSec: number = 5;

    constructor(client: Client, locale: any) {
        this._locale = locale;

        this._distube = new DisTube(client, {
            searchSongs: this._searchSongs,
            leaveOnEmpty: true,
            leaveOnStop: true,
            leaveOnFinish: false,
            savePreviousSongs: false,
            emptyCooldown: this._emptyColldownInSec
        })
        .on(Events.ADD_SONG, async (queue, song) => {
            const embed = new EmbedBuilder()
            .setTitle(this._locale.textOutputWhenAddingNewSongToQueue)
            .setDescription(`${song.name!} | ${song.formattedDuration}`);

            await queue.textChannel?.send( { embeds: [embed] });
        })
        .on(Events.SEARCH_NO_RESULT, async (msg, query) => {
            const embed = new EmbedBuilder()
            .setDescription(`${this._locale.textOutputWhenTrackSearchFails}: ${query}`);
            await msg.channel.send( { embeds: [embed] });
        })
        .on(Events.PLAY_SONG, async (queue, song) => {
            const embed = new EmbedBuilder()
            .setTitle(this._locale.textOutputWhenSongStartedPlaying)
            .setDescription(`${song.name!} | ${song.formattedDuration}`);

            await queue.textChannel?.send( { embeds: [embed] });
        })
        .on(Events.FINISH_SONG, async (queue, song) => {
            const embed = new EmbedBuilder()
            .setTitle(this._locale.textOutputWhenSongStoppedPlaying)
            .setDescription(song.name!);

            await queue.textChannel?.send( { embeds: [embed] });
        })
        .on(Events.ERROR, async (textChannel, err) => {
            console.error(err);
            await textChannel?.send(err.stack ? err.stack : err.message);
        });
    }

    async play(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const queue = this._distube.getQueue(msg);
        if (queue?.playing && !queue?.voiceChannel) {
            queue.remove();
        }

        const embed = new EmbedBuilder();

        if (queue && queue?.voice.channelId !== msg.member?.voice.channelId) {
            embed.setDescription(this._locale.textOutputIfUserIsNotInSameVoiceChannelWithBot);
            await msg.channel.send( { embeds: [embed] });
            return;
        }

        const params = getCommandParams(msg);
        if (params) {
            const arg = params.join(' ');
            await this._distube.play(msg.member?.voice?.channel!, arg, {
                textChannel: msg.channel as GuildTextBasedChannel
            });
        }
        else {
            embed.setDescription(this._locale.playCommandOutputIfArgDoesNotExist);
            await msg.channel.send( { embeds: [embed] });
        }
    }

    async skip(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();
        
        const queue = this._distube.getQueue(msg);
        if (queue) {
            if (queue.songs.length === 1) {
                await this.stop(msg);
                return;
            }

            await queue.skip();
            embed.setDescription(this._locale.skipCommandOutputWhenTrackSkipped);
        }
        else {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async queue(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();

        const queue = this._distube.getQueue(msg);
        if (!queue) {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }
        else {
            const firstSongName = queue.songs![0].name;
            embed.setTitle(`${this._locale.queueCommandOutputForFirstTrack} ${firstSongName}${queue.songs.length > 1 ? ',' : '.'}`);

            const songs = queue.songs
            .map((song, id) => `${id + 1}. ${song.name} | ${song.formattedDuration}`);
            songs.shift();

            if (songs.length !== 0) {
                embed.setDescription(`${songs.join(',\n')}.`);
            }
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async pause(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();

        const queue = this._distube.getQueue(msg);
        if (queue?.playing) {
            queue.pause();
            embed.setDescription(this._locale.pauseCommandOutputIfTrackPaused);
        }
        else if (queue?.paused) {
            queue.resume();
            embed.setDescription(this._locale.pauseCommandOutputIfTrackUnpaused);
        }
        else {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async stop(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();

        const queue = this._distube.getQueue(msg);
        if (queue) {
            await queue.stop();
            embed.setDescription(this._locale.stopCommandOutputIfPlaybackIsFinished);
        }
        else {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async repeat(msg: Message<boolean>): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();

        const queue = this._distube.getQueue(msg);
        if(queue) {
            const playingSong = queue.songs[0].name;

            if (queue.repeatMode === RepeatMode.DISABLED) {
                queue.setRepeatMode(RepeatMode.SONG);
                embed.setDescription(`${playingSong} | ${this._locale.repeatCommandOutputWhenTrackIsSetToRepeat}`);
            }
            else {
                queue.setRepeatMode(RepeatMode.DISABLED);
                embed.setDescription(`${playingSong} | ${this._locale.repeatCommandOutputWhenTrackIsRemovedFromRepeat}`);
            }
        }
        else {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }

        await msg.channel.send( { embeds: [embed] });
    }

    private userInChannel(msg: Message<boolean>): boolean {
        const embed = new EmbedBuilder();

        if (!msg.member?.voice.channel) {
            embed.setDescription(this._locale.textOutputIfUserIsNotInVoiceChannel);
            msg.channel.send( { embeds: [embed] });

            return false;
        }

        return true;
    }
    
}