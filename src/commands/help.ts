import { ICommand, commands } from "./command";
import { embedBorderColor } from "../constants";
import globalContext from "../globalContext";

import { EmbedBuilder, Message } from "discord.js";

export default class Help implements ICommand {
    private readonly _name: string = this.constructor.name.toLowerCase();
    private readonly _description: string;
    private readonly _locale: any;

    constructor() {
        this._locale = globalContext.locale;
        this._description = this._locale.helpCommandDescription;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }
    
    async execute(obj: any): Promise<void>{
        if (!(obj instanceof Message)) {
            return;
        }
        const msg = obj as Message;

        const embed = new EmbedBuilder()
        .setTitle(this._locale.helpCommandOutputTitle)
        .setColor(embedBorderColor);
        
        for (const cmd of commands) {
            embed.addFields( {
                name: `${globalContext.commandPrefix}${cmd.name}`, 
                value: `${cmd.description}`
            });
        }
        
        await msg.channel.send( { embeds: [embed] });
    }
}