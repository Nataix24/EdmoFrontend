export class Panel {
    public element: HTMLDivElement;

    public constructor(parent: HTMLElement | null) {
        this.element = document.createElement("div");

        if (parent)
            this.setParent(parent);
    }

    protected init() {
        this.element.replaceChildren(...this.createPanelContent());
    }

    protected createPanelContent(): HTMLElement[] {
        return [];
    }

    protected setParent(parent: HTMLElement) {
        parent?.appendChild(this.element);
    }

    protected replaceWith(otherElement: HTMLElement) {
        this.element.replaceWith(otherElement);
    }
}