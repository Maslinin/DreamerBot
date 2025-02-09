import { Client } from "discord.js";
import AppConfig from "../../config";

declare module "discord.js" {
    interface Client {
        config: AppConfig;
        addConfig(config: AppConfig): Client;
    }
}

Client.prototype.addConfig = function (config: AppConfig): Client {
    this.config = config;
    return this;
};