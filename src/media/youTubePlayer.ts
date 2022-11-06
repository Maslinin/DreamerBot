import { Client, EmbedBuilder, GuildTextBasedChannel, Message } from "discord.js";
import { DisTube, Events } from "distube";
import { getCommandParams } from "../commands/command";
import { IMediaPlayer } from "./mediaPlayer";

export default class YouTubePlayer implements IMediaPlayer {
    private readonly _distube: DisTube;
    private readonly _locale: any;

    constructor(client: Client, locale: any) {
        this._locale = locale;

        this._distube = new DisTube(client, {
            searchSongs: 1,
            leaveOnStop: true,
            savePreviousSongs: false
        })

        .on(Events.ADD_SONG, async (queue, song) => {
            const embed = new EmbedBuilder()
            .setTitle(this._locale.textOutputWhenAddingNewSongToQueue)
            .setDescription(`${song.name!} - ${song.formattedDuration}`);

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
            .setDescription(`${song.name!} - ${song.formattedDuration}`);

            await queue.textChannel?.send( { embeds: [embed] });
        })
        .on(Events.FINISH_SONG, async (queue, song) => {
            const embed = new EmbedBuilder()
            .setDescription(`${song.name!}- ${this._locale.textOutputWhenSongStoppedPlaying}`);

            await queue.textChannel?.send( { embeds: [embed] });
        })
        .on(Events.ERROR, async (textChannel, err) => {
            console.error(err);
            await textChannel?.send(err.stack ? err.stack : err.message);
        });
    }

    async play(msg: Message): Promise<void> {
        if (!this.userInChannel(msg)) {
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
            const embed = new EmbedBuilder()
            .setDescription(this._locale.playCommandOutputIfArgDoesNotExist);
            await msg.channel.send( { embeds: [embed] });
        }
    }

    async skip(msg: Message): Promise<void> {
        if (!this.userInChannel(msg)) {
            return;
        }

        const embed = new EmbedBuilder();
        
        let queue = this._distube.getQueue(msg);
        if (queue) {
            await queue.skip();
            embed.setDescription(this._locale.skipCommandOutputWhenTrackSkipped);
        }
        else {
            embed.setDescription(this._locale.textOutputIfThereIsNoPlayback);
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async queue(msg: Message): Promise<void> {
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
            .map((song, id) => `${id + 1}. ${song.name} - ${song.formattedDuration}`);
            songs.shift();

            if (songs.length !== 0) {
                embed.setDescription(`${songs.join(',\n')}.`);
            }
        }

        await msg.channel.send( { embeds: [embed] });
    }

    async pause(msg: Message): Promise<void> {
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

    async stop(msg: Message): Promise<void> {
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

    private async userInChannel(msg: Message): Promise<boolean> {
        const embed = new EmbedBuilder();

        if (!msg.member?.voice.channel) {
            embed.setDescription(this._locale.textOutputIfUserIsNotInVoiceChannel);
            await msg.channel.send( { embeds: [embed] });

            return false;
        }

        return true;
    }
    
}