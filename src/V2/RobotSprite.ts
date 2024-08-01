import { Control, Image, Rectangle } from "@babylonjs/gui";
import { IUpdatable } from "./IUpdatable";

export class RobotSprite extends Image implements IUpdatable {
    private static readonly robotImages: string[] = [
        "./Assets/Textures/robot1.png",
        "./Assets/Textures/robot2.png",
        "./Assets/Textures/robot3.png",
        "./Assets/Textures/robot4.png"
    ];

    public constructor() {
        super("Robot", RobotSprite.robotImages[0]);

        this.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.width = this.height = 0.2;
        this.fixedRatio = 1;
        this.isPointerBlocker = true;
        this.onPointerEnterObservable.add(this.onMouseOver.bind(this));
    }

    private timer = 0;
    private animating = false;

    private onMouseOver() {
        this.animating = true;
        this.taskPopUp();
    }

    private readonly animInterval: number = 0.200;

    public Update(deltaTime: number) {
        if (!this.animating)
            return;

        this.timer += deltaTime;

        if (this.timer > 8 * this.animInterval) {
            this.timer = 0;
            this.animating = false;
        }

        var frameNumber = Math.floor(this.timer / this.animInterval);

        if (frameNumber >= 4 && frameNumber < 6) // The robot keeps their hand up for another 2 frames
            frameNumber = 3;
        else if (frameNumber >= 6) // Before going back down
            frameNumber = 6 - (frameNumber - 2);

        this.source = RobotSprite.robotImages[frameNumber];
    }
    private taskPopUp(){
        let popup = new Rectangle();
        // Set properties on the Rectangle
        popup.width = "200px";
        popup.height = "100px";
        popup.color = "white";
        popup.background = "black";
        console.log("im in method");
    }
}
