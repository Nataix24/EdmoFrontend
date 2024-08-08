export class RobotSprite2 extends HTMLDivElement {
    private static readonly robotImagesURI: string[] = [
        "./Assets/Textures/robot1.png",
        "./Assets/Textures/robot2.png",
        "./Assets/Textures/robot3.png",
        "./Assets/Textures/robot4.png"
    ];

    private timer: any | null;

    private currentSprite = 0;

    public constructor() {
        super();

        this.setImage(RobotSprite2.robotImagesURI[0]);
        this.style.aspectRatio = "1";
    }

    private setImage(uri: string) {
        this.style.backgroundImage = `url(${uri})`;
    }

    private updateWave() {
        this.currentSprite++;

        if (this.currentSprite > 3) {
            this.currentSprite = 0;
            clearInterval(this.timer);
        }

        this.setImage(RobotSprite2.robotImagesURI[this.currentSprite]);
    }

    public wave() {
        if (this.timer instanceof NodeJS.Timeout)
            clearInterval(this.timer);

        this.timer = setInterval(this.updateWave.bind(this), 200);
    }


}