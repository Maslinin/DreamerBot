import IMediaPlayer from "./media/mediaPlayer";
import getLocale from "./locales/localeFactory";
import { locale } from "./config.json";
import { Client, Locale } from "discord.js";

export interface IGlobalContext {
    get discordClient(): Client;
    set discordClient(discordClient: Client);
    get mediaPlayer(): IMediaPlayer;
    set mediaPlayer(mediaPlayer: IMediaPlayer);
    get commandPrefix(): string;
    set commandPrefix(commandPrefix: string);
    get locale(): any;
    set locale(locale: any);
}

class DefaultGlobalContext implements IGlobalContext {
    private _discordClient!: Client;
    private _mediaPlayer!: IMediaPlayer;
    private _commandPrefix!: string;
    private _locale: any;

    constructor() {
        this._locale = getLocale(locale as Locale);
    }

    get discordClient(): Client {
        return this._discordClient;
    }

    set discordClient(discordClient: Client) {
        this._discordClient = discordClient;
    }

    get mediaPlayer(): IMediaPlayer {
        return this._mediaPlayer;
    }

    set mediaPlayer(mediaPlayer: IMediaPlayer) {
        this._mediaPlayer = mediaPlayer;
    }

    get commandPrefix(): string {
        return this._commandPrefix;
    }

    set commandPrefix(commandPrefix: string) {
        this._commandPrefix = commandPrefix;
    }

    get locale(): any {
        return this._locale;
    }

    set locale(locale: any) {
        this._locale = locale;
    }
}

const globalContext: IGlobalContext = new DefaultGlobalContext();
export default globalContext;