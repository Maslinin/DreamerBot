import globalContext from "./globalContext";
import YouTubePlayer from "./media/youTubePlayer";
import DiscordClientBuilder from "./discordClientBuilder";
import { botToken } from "./config.json";

const client = new DiscordClientBuilder()
.onCommand()
.build();

globalContext.discordClient = client;
globalContext.mediaPlayer = new YouTubePlayer(globalContext.discordClient, globalContext.locale);

try {
    globalContext.discordClient.login(botToken);
}
catch(err) {
    console.log((err as Error).stack);
}
