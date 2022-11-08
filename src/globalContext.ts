import ConfigData from "./config.json";
import getLocale from "./locales/localeFactory";
import YouTubePlayer from "./media/youTubePlayer";

import IMediaPlayer from "./media/mediaPlayer";
import { Client, GatewayIntentBits, Locale } from "discord.js";

export interface IGlobalContext {
    get discordClient(): Client;
    get mediaPlayer(): IMediaPlayer;
    get commandPrefix(): string;
    get locale(): any;
}

class DefaultGlobalContext implements IGlobalContext {
    private readonly _discordClient: Client;
    private readonly _mediaPlayer: IMediaPlayer;
    private readonly _commandPrefix: string;
    private readonly _locale: any;

    constructor() {
        this._locale = getLocale(ConfigData.locale as Locale);
        this._discordClient = new Client({
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ]
        });
        this._mediaPlayer = new YouTubePlayer(this._discordClient, this._locale);
        this._commandPrefix = ConfigData.commandPrefix;
    }

    get discordClient(): Client {
        return this._discordClient;
    }

    get mediaPlayer(): IMediaPlayer {
        return this._mediaPlayer;
    }

    get commandPrefix(): string {
        return this._commandPrefix;
    }

    get locale(): any {
        return this._locale;
    }

}

const globalContext: IGlobalContext = new DefaultGlobalContext();
export default globalContext;