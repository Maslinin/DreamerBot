import { Client, Events } from "discord.js";

export default (client: Client): void => {
    client.once(Events.ClientReady, () => {
        console.log(`Ready! Logged in as ${client.user?.tag}`);
    });
};