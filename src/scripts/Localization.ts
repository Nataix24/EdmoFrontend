import { fetchData } from "./API";

export class LocalizationManager {
    private static localisationBanks: any[] = [];
    private static currentLanguage = "nl";

    static {
        this.currentLanguage = localStorage.getItem("language") ?? "nl";
    }

    public static async loadLocalisationBanks(...localizationURIs: string[]) {
        for (const localizationURI of localizationURIs) {
            const bank = await fetchData(localizationURI);
            if (!bank)
                return;

            this.localisationBanks.push(bank);
        }

        this.applyLocalisationToAllElements();
    }

    static get CurrentLanguage(): string {
        return this.currentLanguage;
    }

    public static getString(key: string, args: any = null) {
        for (const bank of this.localisationBanks) {
            if (!(key in bank))
                continue;

            const localisationEntry = bank[key];

            if (!(this.currentLanguage in localisationEntry))
                continue;

            return this.format(localisationEntry[this.currentLanguage], args);
        }

        const msg: string = `Can't find string with key {${key}} for language code {${this.currentLanguage}}`;
        console.log(msg);


        return "";
    }

    public static getKeysFor(sentence: string) {
        const words = sentence.split(" ");
        return words.map(this.getKeyFor.bind(this));
    }

    // Is not very quick, don't use it too enthusiastically
    private static getKeyFor(word: string) {
        for (const bank of this.localisationBanks) {
            for (const key in bank) {
                if (!word.localeCompare(key, undefined, { sensitivity: "accent" }))
                    return key;

                const languages = bank[key];
                for (const language in languages) {
                    if (!word.localeCompare(languages[language], undefined, { sensitivity: "accent" }))
                        return key;
                }
            }
        }
        return "";
    }

    public static addLocalisationBanks(...localisationBanks: NonNullable<any>[]) {
        for (const bank of localisationBanks)
            this.localisationBanks.push(bank);

        this.applyLocalisationToAllElements();
    }

    public static clearLocalisationBanks() {
        this.localisationBanks = [];
    }

    private static findAllLocalizableElements() {
        return document.querySelectorAll('[data-i18n-key]');
    }

    public static setLocalisationKey(element: HTMLElement, i18nkey: string, i18nArgs: object | null = null) {
        element.setAttribute("data-i18n-key", i18nkey);

        if (i18nArgs)
            element.setAttribute("data-i18n-args", JSON.stringify(i18nArgs));

        this.applyLocalisation(element);
    }

    public static removeLocalisationKey(element: HTMLElement) {
        element.removeAttribute("data-i18n-key");
        element.removeAttribute("data-i18n-args");

    }

    public static setLanguage(languageCode: string) {
        this.currentLanguage = languageCode;
        localStorage.setItem("language", languageCode);

        this.applyLocalisationToAllElements();
    }

    public static applyLocalisation(element: HTMLElement) {
        const i18nKey = element.getAttribute("data-i18n-key");

        const i18nArgsAtt = element.getAttribute("data-i18n-args");
        const i18nArgs = i18nArgsAtt ? JSON.parse(i18nArgsAtt) : null;

        if (!i18nKey)
            return;

        const localisedText = this.getString(i18nKey, i18nArgs);

        if (element instanceof HTMLInputElement) {
            element.placeholder = localisedText;
        }
        else {
            element.innerText = localisedText;
        }
    }

    public static applyLocalisationToAllElements() {
        const targets = this.findAllLocalizableElements();

        for (const target of targets) {
            if (!(target instanceof HTMLElement))
                continue;

            this.applyLocalisation(target);
        }
    }

    private static format(format: string, args: any = null) {
        if (!args)
            return format;


        return format.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
            if (m == "{{") { return "{"; }
            if (m == "}}") { return "}"; }

            if (!(n in args))
                return `{${n}}`;

            return args[n];
        });
    }
}