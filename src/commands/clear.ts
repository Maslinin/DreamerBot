import { ICommand, getCommandParams } from "./command";
import globalContext from "../globalContext";

import { Message, TextChannel } from "discord.js";

export default class Clear implements ICommand {
    private readonly _name: string = this.constructor.name.toLowerCase();
    private readonly _description: string;
    private readonly _locale: any;

    constructor() {
        this._locale = globalContext.locale;
        this._description = this._locale.clearCommandDescription;
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
        const channel = msg.channel as TextChannel;

        if (channel) {
            const params = getCommandParams(msg);
            if(!params) {
                await msg.channel.send(this._locale.clearCommandOutputIfThereAreNoArgs);
                return;
            }
    
            const num = +params;
            if (isNaN(num)) {
                await msg.channel.send(this._locale.clearCommandOutputIfArgIsNotNum);
                return;
            }
    
            await channel.bulkDelete(num, true)
            .then(() => {
                msg.channel.send(`${this._locale.clearCommandOutputIfSuccessful} ${num}`);
            });
        }
    }

}
