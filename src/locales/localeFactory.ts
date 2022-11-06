import enLocale from "./en-locale.json";
import ruLocale from "./ru-locale.json";

import { Locale } from "discord.js";

export default function getLocale(locale: Locale): any {
    switch(locale) {
        case Locale.EnglishUS:
            return enLocale;
        case Locale.Russian:
            return ruLocale;
        default: 
            throw new Error(`Locale ${locale} is not defined`);
    }
}