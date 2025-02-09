import { 
    SlashCommandBuilder, 
    AutocompleteInteraction,
    ChatInputCommandInteraction, 
    SlashCommandOptionsOnlyBuilder
} from "discord.js";

export type Command = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
    execute?: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
};

export function isCommand(value: any): value is Command {
    return (
        typeof value === "object" &&
        value !== null &&
        !!(value as Command)?.data
    );
}
