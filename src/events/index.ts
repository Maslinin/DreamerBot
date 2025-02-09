import { Client } from "discord.js";
import handleReady from "./ready";
import handleUserJoined from "./userJoined";
import handleUserLeft from "./userLeft";
import handleInteractionCreate from "./interactionCreate";

declare module "discord.js" {
    interface Client {
        handleReady(): Client;
        handleUserJoined(): Client;
        handleUserLeft(): Client;
        handleInteractionCreate(): Client;
    }
}

Client.prototype.handleReady = function () {
    handleReady(this);
    return this;
};

Client.prototype.handleUserJoined = function () {
    handleUserJoined(this);
    return this;
};

Client.prototype.handleUserLeft = function () {
    handleUserLeft(this);
    return this;
};

Client.prototype.handleInteractionCreate = function () {
    handleInteractionCreate(this);
    return this;
};
