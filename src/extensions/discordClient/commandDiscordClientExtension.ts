import { Client, Collection } from "discord.js";
import { Command } from "../../commands/command";

declare module "discord.js" {
    interface Client {
        commands: Collection<string, Command>;
        addCommands(commands: Collection<string, Command>): Client;
    }
}

Client.prototype.addCommands = function (commands: Collection<string, Command>): Client {
    this.commands = commands;
    return this;
};