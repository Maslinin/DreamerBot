import { Events } from "discord.js";
import { botToken } from "./config.json"
import { isCommand } from "./commands/command";
import cmdFactory from "./commands/commandFactory";
import globalContext from "./globalContext";

const client = globalContext.discordClient;

try {
    client.on(Events.MessageCreate || Events.MessageUpdate, async msg => {
        if (msg.author.bot || !msg.inGuild()) {
            return;
        }
        
        if (!isCommand(msg)) {
            return;
        }
    
        let cmd = cmdFactory.getCommand(msg);
        if (cmd) {
            await cmd.execute(msg);
        } 
        else {
            await msg.channel.send(globalContext.locale.commandDoesNotExistMessage);
        }
    })
    
    client.login(botToken);    
}
catch(err) {
    console.log((err as Error).stack);
}
