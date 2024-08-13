export class BloomSprite {
    private static readonly imagesURI: string[] = [
        "./Assets/Textures/Bloom/Idle.png",
        "./Assets/Textures/Bloom/Idle+Wave.png",
        "./Assets/Textures/Bloom/IdleBlink.png",
        "./Assets/Textures/Bloom/IdleBlink+Wave.png",
        "./Assets/Textures/Bloom/Speaking.png",
        "./Assets/Textures/Bloom/Speaking+Wave.png",
        "./Assets/Textures/Bloom/SpeakingBlink.png",
        "./Assets/Textures/Bloom/SpeakingBlink+Wave.png",
    ];

    private static readonly cachedImages: HTMLImageElement[] = [];

    private blinking: boolean = false;
    private speaking: boolean = false;
    private waving: boolean = false;

    private scaleFactor = 0;

    private blinkFrames = 0;
    private waveFrames = 0;
    private speakFrames = 0;

    private mouthSwitchFrames = 0;


    static {
        for (const uri of this.imagesURI) {
            const image = new Image();
            image.src = uri;
            this.cachedImages.push(image);
        }
    }

    private readonly target: HTMLDivElement;
    private readonly timer: any = null!;

    public constructor(element: HTMLDivElement) {
        this.target = element;
        this.target.className = "bloomSprite hidden";

        this.setImage(BloomSprite.imagesURI[0]);
        this.target.addEventListener("mouseover", this.onMouseOver.bind(this));

        this.timer = setInterval(this.update.bind(this), 16);
    }

    public update() {
        if (!this.blinking) {
            const blinkChance = 1 / 200;

            if (Math.random() <= blinkChance) {
                this.blinking = true;
                this.blinkFrames = Math.floor(Math.random() * 5 + 5);
            }
        }
        else {
            if (--this.blinkFrames == 0)
                this.blinking = false;
        }

        if (this.waving && --this.waveFrames <= 0) {
            this.waving = false;
        }

        if (this.speakFrames > 0) {
            --this.mouthSwitchFrames;
            --this.speakFrames;
            if (this.mouthSwitchFrames <= 0) {
                this.speaking = !this.speaking;
                this.mouthSwitchFrames = Math.floor(Math.random() * 10);
            }
        }
        else {
            this.speaking = false;
        }

        let spriteIndex = 0;
        if (this.speaking) spriteIndex += 4;
        if (this.blinking) spriteIndex += 2;
        if (this.waving) spriteIndex += 1;

        this.setImage(BloomSprite.imagesURI[spriteIndex]);
    }

    private onMouseOver(ev: Event) {
        this.wave();
    }


    private setImage(uri: string) {
        this.target.style.backgroundImage = `url(${uri})`;
    }

    public wave() {
        this.waving = true;
        this.waveFrames = 40;
    }

    public speak() {
        this.speaking = true;
        this.speakFrames = 300;
    }

    public show() {
        this.target.classList.remove("hidden");
        this.wave();
    }
    public hide() {
        this.wave();
        this.target.classList.add("hidden");
    }
}