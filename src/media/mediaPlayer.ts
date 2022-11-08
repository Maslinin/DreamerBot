import { Message } from "discord.js";

export interface IMediaPlayer {
    play(msg: Message): Promise<void>;
    skip(msg: Message): Promise<void>;
    queue(msg: Message): Promise<void>;
    pause(msg: Message): Promise<void>;
    stop(msg: Message): Promise<void>;
    repeat(msg: Message): Promise<void>;
}