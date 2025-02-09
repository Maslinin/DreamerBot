import { Client } from "discord.js";
import { IMusicPlayer } from "../../music/musicPlayer";

declare module "discord.js" {
    interface Client {
        musicPlayer: IMusicPlayer;
        addMusicPlayer(musicPlayer: IMusicPlayer): Client;
    }
}

Client.prototype.addMusicPlayer = function (musicPlayer: IMusicPlayer): Client {
    this.musicPlayer = musicPlayer;
    return this;
};