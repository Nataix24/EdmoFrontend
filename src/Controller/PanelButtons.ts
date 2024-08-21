
export interface PanelButtonEntry {
    faIcon: string;
    selectionCallback: () => void;
    overlayElement?: HTMLElement;
}

export class PanelButtons {
    public readonly element: HTMLDivElement;
    private readonly buttons: HTMLDivElement[];

    private readonly entries: PanelButtonEntry[] = [];

    private currentSelection: number = -1;


    public constructor(entries: PanelButtonEntry[]) {
        this.entries = entries;

        const element = this.element = document.createElement("div");
        element.className = "panelButtons";

        this.buttons = entries.map((entry, index) => PanelButtons.createButton(entry.faIcon, () => { this.CurrentSelection = index; }, entry.overlayElement));

        this.CurrentSelection = 0;

        element.replaceChildren(...this.buttons);
    }

    set CurrentSelection(selection: number) {
        if (this.currentSelection == selection)
            return;

        if (this.currentSelection != -1)
            this.buttons[this.currentSelection].classList.remove("panelButtonSelected");
        this.buttons[selection].classList.add("panelButtonSelected");
        this.currentSelection = selection;
        try {
            this.entries[selection].selectionCallback();
        }
        catch (e) { }
    }

    private static createButton(iconName: string, onClickCallback: () => void, overlayElement?: HTMLElement) {
        const div = document.createElement("div");
        div.className = "panelButton";

        const icon = document.createElement("i");
        icon.className = `panelButtonIcon fa-solid ${iconName}`;

        if (overlayElement)
            icon.appendChild(overlayElement);

        div.appendChild(icon);
        div.addEventListener("click", _ => onClickCallback());

        return div;
    }
}
