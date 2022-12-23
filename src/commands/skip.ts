import { ICommand } from "./command";
import globalContext from "../globalContext";
import IMediaPlayer from "../media/mediaPlayer";

import { Message } from "discord.js";

export default class Skip implements ICommand {
    private readonly _name: string = this.constructor.name.toLowerCase();
    private readonly _description: string;
    private readonly _mediaPlayer: IMediaPlayer;
    private readonly _locale: any;

    constructor() {
        this._locale = globalContext.locale;
        this._description = this._locale.skipCommandDescription;
        this._mediaPlayer = globalContext.mediaPlayer;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }
    
    async execute(obj: any): Promise<void> {
        if (!(obj instanceof Message)) {
            return;
        }
        const msg = obj as Message;

        await this._mediaPlayer.skip(msg);
    }

}
