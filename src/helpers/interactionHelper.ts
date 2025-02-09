import { 
    BaseGuildTextChannel,
    Guild,
    GuildMember, 
    Interaction, 
    Locale, 
    PermissionsBitField,
    VoiceBasedChannel
} from "discord.js";

export function getGuild(interaction: Interaction): Guild {
    return interaction.guild!;
}

export function getGuildId(interaction: Interaction): string {
    return interaction.guildId!;
}

export function getGuildMember(interaction: Interaction): GuildMember {
    return interaction.member as GuildMember;
}

export function getGuildMemberLocale(interaction: Interaction): Locale {
    return interaction.locale;
}

export function getBotAsGuildMember(interaction: Interaction): GuildMember {
    return interaction.guild?.members.me!;
}

export function getBaseGuildTextChannel(interaction: Interaction): BaseGuildTextChannel {
    return interaction.channel as BaseGuildTextChannel;
}

export function getMemberPermissions(interaction: Interaction): PermissionsBitField {
    return interaction.member?.permissions as PermissionsBitField;
}

export function getCurrentVoiceChannel(interaction: Interaction): VoiceBasedChannel | null {
    const member = getGuildMember(interaction);
    return member.voice?.channel;
}

export function isUserNotInVoiceChannel(member: GuildMember): boolean {
    return !!!member?.voice?.channel;
}

export function isUserNotInSameVoiceChannelAsBot(member: GuildMember, bot: GuildMember): boolean {
    const userVoiceChannel = member.voice?.channel;

    const botVoiceChannel = bot.voice.channel;
    if (!botVoiceChannel) return false;

    return userVoiceChannel?.id !== botVoiceChannel?.id;
}