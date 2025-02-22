import { Client, GatewayIntentBits } from "discord.js";
import AppConfig from "./config";
import ModuleCommandRegister from "./commands/registers/moduleCommandRegister";
import YouTubeiPlayer from "./music/youTubeiDiscordPlayer";
import logger from "./loggers/log4jsLogger";
import "./events";
import "./extensions/discordClient"

try {
    const config = await AppConfig.get();

    const commandRegister = new ModuleCommandRegister(config);
    const commands = await commandRegister.Register();

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,                
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates
        ]
    });

    const musicPlayer = await (new YouTubeiPlayer(client))
        .loadExtractors();

    client
        .addConfig(config)
        .addCommands(commands)
        .addMusicPlayer(musicPlayer);

    client
        .handleReady()
        .handleUserJoined()
        .handleUserLeft()
        .handleInteractionCreate()

    await client.login(config.auth?.botToken);
}
catch(err) {
    logger.error(err);
}