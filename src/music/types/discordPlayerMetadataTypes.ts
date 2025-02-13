import { BaseGuildTextChannel, Locale } from "discord.js";

export interface IQueueMetadata {
    channel: BaseGuildTextChannel;
    locale: Locale;
}
