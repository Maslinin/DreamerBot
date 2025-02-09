import { Collection, REST, Routes, Snowflake } from 'discord.js';
import ICommandRegister from "./commandRegister";
import AppConfig from '../../config';
import { Command, isCommand } from '../command';
import { Path } from "../../constants";
import { getModules } from '../../helpers/fsHelper';

export default class ModuleCommandRegister implements ICommandRegister {
    private readonly _rest: REST;
    private readonly _clientId: Snowflake;

    constructor(config: AppConfig) {
        if (!config.auth?.botToken || !config.register?.clientId) {
            throw new Error("Missing required configuration for command registration.");
        }

        this._rest = new REST().setToken(config.auth.botToken);
        this._clientId = config.register.clientId;
    }

    public async Register(): Promise<Collection<string, Command>> {
        const commands = await this.loadCommands();
        await this.updateCommands(commands);

        return commands;
    }

    private async loadCommands(): Promise<Collection<string, Command>> {
        const commands = new Collection<string, Command>();

        const modules = await getModules(Path.commands);
        for (const module of modules) {
            const resolvedModule = module.default;
            if (isCommand(resolvedModule)) {
                commands.set(resolvedModule.data.name, resolvedModule);
            }
        }

        return commands;
    }

    private async updateCommands(commands: Collection<string, Command> ): Promise<unknown> {
        return await this._rest.put(
            Routes.applicationCommands(this._clientId),
            { body: commands.map(c => c.data.toJSON()) }
        );
    }
}