export class FeedbackBubble {
    private target: HTMLDivElement;

    private timer: any;

    public constructor(element: HTMLDivElement) {
        this.target = element;
    }

    public show(text: string) {
        this.target.innerText = text;
        this.target.classList.remove("hidden");

        if (this.timer != null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timer = setInterval(this.hide.bind(this), 5000);
    }

    public hide() {
        this.target.classList.add("hidden");
        clearInterval(this.timer);
    }

}