import { Events } from "discord.js";
import { isCommand } from "./commands/command";
import cmdFactory from "./commands/CommandFactory";
import { botToken } from "./config.json"
import globalContext from "./globalContext";

const client = globalContext.discordClient;

client.on(Events.MessageCreate || Events.MessageUpdate, async msg => {
    if (msg.author.bot || !msg.inGuild()) {
        return;
    }
    
    if (!isCommand(msg)) {
        return;
    }

    try {
        let cmd = cmdFactory.getCommand(msg);
        if (cmd) {
            await cmd.execute(msg);
        } 
        else {
            await msg.channel.send(globalContext.locale.commandDoesNotExistMessage);
        }
    }
    catch (err) {
        console.log((err as Error).stack);
    }
})

client.login(botToken);
