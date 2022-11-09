import { ICommand, commands } from "./command";
import globalContext from "../globalContext";

import { Message } from "discord.js";

class CommandFactory {
    private readonly _commands: ICommand[];
    private readonly _commandPrefix: string;

    constructor() {
        this._commands = commands;
        this._commandPrefix = globalContext.commandPrefix;
    }

    getCommand(msg: Message): ICommand | null {
        const content = msg.content;

        const commandName = content
        .split(/ +/)[0]
        .substring(this._commandPrefix.length)
        .toLowerCase();

        return this._commands.find(x => x.name === commandName) ?? null;
    }
}

const cmdFactory: CommandFactory = new CommandFactory();
export default cmdFactory;