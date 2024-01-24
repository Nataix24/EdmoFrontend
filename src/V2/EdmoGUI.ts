import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { IUpdatable } from "./IUpdatable";
import { RobotSprite } from "./RobotSprite";
import { ControlPanel } from "./ControlPanel";
import { EdmoProperty } from "./EdmoProperty";

type EdmoSliderCallback = (type: EdmoProperty, value: number, userAdjusted : boolean) => void;

export class EdmoGUI implements IUpdatable {
    private fullscreenUI: AdvancedDynamicTexture;
    private robot: RobotSprite;
    private controlPanel: ControlPanel;

    public constructor() {
        this.fullscreenUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true);
        this.fullscreenUI.addControl(this.robot = new RobotSprite());
        this.fullscreenUI.addControl(this.controlPanel = new ControlPanel());
    }

    public onSliderChanged(callback: EdmoSliderCallback) {
        this.controlPanel.onSliderValueChanged(callback);
    }

    public Update(deltaTime: number) {
        this.robot.Update(deltaTime);
    }

    public UpdateFrequencySlider(value: number) {
        this.controlPanel.UpdateFrequencySlider(value);
    }

    public ShowDisconnectionMessage() {
        this.controlPanel.showDisconnectionMessage();
    }
}
