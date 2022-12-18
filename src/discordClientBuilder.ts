import { isCommand } from "./commands/command";
import cmdFactory from "./commands/commandFactory";
import globalContext from "./globalContext";

import { Client, Events, GatewayIntentBits } from "discord.js";

export default class DiscordClientBuilder {
    private readonly _client: Client;
    
    constructor () {
        this._client = new Client({
            intents: [
                GatewayIntentBits.Guilds, 
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent
            ]
        });
    }

    onCommand() : DiscordClientBuilder {
        this._client.on(Events.MessageCreate || Events.MessageUpdate, async msg => {
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
        });

        return this;
    }

    build(): Client {
        return this._client;
    }
}