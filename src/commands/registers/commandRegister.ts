import { Collection } from "discord.js";
import { Command } from "../command";

export default interface ICommandRegister {
    Register(): Promise<Collection<string, Command>>;
}