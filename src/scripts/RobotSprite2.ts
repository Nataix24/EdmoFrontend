export class RobotSprite2 {
    private static readonly robotImagesURI: string[] = [
        "./Textures/robot1.png",
        "./Textures/robot2.png",
        "./Textures/robot3.png",
        "./Textures/robot4.png"
    ];

    private static readonly cachedImages: HTMLImageElement[] = [];

    static {
        for (const uri of this.robotImagesURI) {
            const image = new Image();
            image.src = uri;
            this.cachedImages.push(image);
        }
    }

    private timer: any | null;

    private frameNumber = 0;
    private target: HTMLDivElement;

    public constructor(element: HTMLDivElement) {
        this.target = element;

        this.setImage(RobotSprite2.robotImagesURI[0]);
        this.target.addEventListener("mouseover", this.onMouseOver.bind(this));

    }

    private setImage(uri: string) {
        this.target.style.backgroundImage = `url(${uri})`;
    }

    private updateWave() {
        this.frameNumber++;
        let frameNumber = this.frameNumber;

        if (frameNumber >= 4 && frameNumber < 6) // The robot keeps their hand up for another 2 frames
            frameNumber = 3;
        else if (frameNumber >= 6 && frameNumber <= 8) // Before going back down
            frameNumber = 6 - (frameNumber - 2);
        else if (frameNumber >= 8) {
            frameNumber = this.frameNumber = 0;
            clearInterval(this.timer);
        }

        this.setImage(RobotSprite2.robotImagesURI[frameNumber]);
    }

    public show() {
        this.target.classList.remove("hidden");
        this.wave(100);
    }
    public hide() {
        this.target.classList.add("hidden");
    }

    public speak() {

    }

    private onMouseOver(ev: Event) {
        this.wave();
    }

    public wave(time: number = 200) {
        if (this.timer != null) {
            clearInterval(this.timer);
            this.frameNumber = 0;
        }

        this.timer = setInterval(this.updateWave.bind(this), time);
    }


}