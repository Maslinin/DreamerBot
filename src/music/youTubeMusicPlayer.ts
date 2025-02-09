import { DiscordMusicPlayer } from "./discordMusicPlayer";
import { YoutubeiExtractor } from "discord-player-youtubei";

export default class YouTubeMusicPlayer extends DiscordMusicPlayer {
    protected async registerExtractors(): Promise<void> {
        await this._player.extractors.register(YoutubeiExtractor, { });
    }
}