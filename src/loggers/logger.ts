export interface ILogger {
    error(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    info(message: any, ...args: any[]): void;
    debug(message: any, ...args: any[]): void;
    trace(message: any, ...args: any[]): void;
}