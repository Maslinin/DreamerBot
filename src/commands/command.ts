import Clear from "./clear";
import Help from "./help";
import Pause from "./pause";
import Play from "./play";
import Queue from "./queue";
import Skip from "./skip";
import Stop from "./stop";
import Repeat from "./repeat";

import globalContext from "../globalContext";
import { Message } from "discord.js";

export interface ICommand {
    get name(): string;
    get description(): string;
    execute(obj: any): Promise<void>;
}

export const commands: ICommand[] = [
    new Help(),
    new Play(),
    new Stop(),
    new Pause(),
    new Skip(),
    new Queue(),
    new Repeat(),
    new Clear()
]
.sort((x, y) => x.name.localeCompare(y.name));

export function isCommand(msg: Message): boolean {
    const cmd = msg.content.trim();

    if (cmd.length > 1) {
        return cmd.startsWith(globalContext.commandPrefix);
    }
    
    return false;
}

export function getCommandParams(msg: Message): string[] | null {
    const params = msg.content.split(' ');
    params.shift();
    params.map(x => x.trim());
    
    return params.length > 0 ? params : null;
}