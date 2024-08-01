import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { IUpdatable } from "./IUpdatable";
import { RobotSprite } from "./RobotSprite";
import { EdmoProperty } from "./EdmoProperty";

type EdmoSliderCallback = (type: EdmoProperty, value: number, userAdjusted: boolean) => void;

export class EdmoGUI implements IUpdatable {
    private fullscreenUI: AdvancedDynamicTexture;
    private robot: RobotSprite;

    public constructor() {
        this.fullscreenUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true);
        this.fullscreenUI.addControl(this.robot = new RobotSprite());
    }

    public onSliderChanged(callback: EdmoSliderCallback) {
    }

    public Update(deltaTime: number) {
        this.robot.Update(deltaTime);
    }

    public UpdateFrequencySlider(value: number) {
    }

    public ShowDisconnectionMessage() {
    }
}
