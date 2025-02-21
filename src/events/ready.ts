import { Client, Events } from "discord.js";
import logger from "../loggers/log4jsLogger";

export default (client: Client): void => {
    client.once(Events.ClientReady, () => {
        logger.info('Ready! Logged in as %s', client.user?.tag);
    });
};