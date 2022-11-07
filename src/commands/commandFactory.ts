import ICommand, { commands } from "./command";

import { Message } from "discord.js";
import globalContext from "../globalContext";

class CommandFactory {
    private readonly _commandPrefix: string;
    private readonly _commands: ICommand[];

    constructor() {
        this._commandPrefix = globalContext.commandPrefix;
        this._commands = commands;
    }

    getCommand(msg: Message): ICommand | null {
        const content = msg.content;

        let commandName = content.split(' ')[0].trim().toLowerCase();
        commandName = commandName.substring(this._commandPrefix.length);

        return this._commands.find(x => x.name === commandName) ?? null;
    }
}

const cmdFactory: CommandFactory = new CommandFactory();
export default cmdFactory;