import { DiscordPlayer } from "./discordPlayer";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { MusicPlayerSettings } from "../constants";

export default class YouTubeiPlayer extends DiscordPlayer {
    protected async registerExtractors(): Promise<void> {
        await this._player.extractors.register(YoutubeiExtractor, {
            streamOptions: {
                highWaterMark: MusicPlayerSettings.youTubei.highWaterMark
            }
         });
    }
}