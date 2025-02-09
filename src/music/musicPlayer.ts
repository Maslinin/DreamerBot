import { Interaction } from "discord.js";

export interface IMusicPlayer<
    TTrack = unknown,
    TQueue = unknown
> {
    search(query: string): Promise<TTrack[]>;
    play(interaction: Interaction, query: TTrack): Promise<PlayerState>;
    skip(interaction: Interaction): Promise<PlayerState>;
    stop(interaction: Interaction): Promise<PlayerState>;
    pause(interaction: Interaction): Promise<PlayerState>;
    repeat(interaction: Interaction, repeatMode: RepeatMode): Promise<PlayerState>;
    queue(interaction: Interaction, start: number, limit: number): Promise<[
        PlayerState, 
        TTrack[] | Partial<TTrack>[], 
        boolean
    ]>;

    getCurrentTrack(guildId: string): TTrack | Partial<TTrack> | null;
    getCurrentQueue(guildId: string): TQueue | null;
}

export enum RepeatMode {
    Off,
    Track,
    Queue
}

export enum PlayerState {
    PlayingInAnotherChannel,
    QueueDoesNotExist,
    QueueIsEmpty,
    QueueRetrieved,
    AddedToQueue,
    Paused,
    AlreadyPaused,
    Resumed,
    AlreadyResumed,
    Skipped,
    Stopped,
    RepeatDisabled,
    RepeatAlreadyDisabled,
    RepeatTrackEnabled,
    RepeatTrackAlreadyEnabled,
    RepeatQueueEnabled,
    RepeatQueueAlreadyEnabled,
    UnknownError
}
