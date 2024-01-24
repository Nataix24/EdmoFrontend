import { AdvancedDynamicTexture, Control, StackPanel } from "@babylonjs/gui";
import { IUpdatable } from "./IUpdatable";
import { RobotSprite } from "./RobotSprite";
import { ControlPanel } from "./ControlPanel";
import { EdmoProperty } from "./EdmoProperty";
import { EdmoRectVisual } from "./EdmoRectVisual";
import { EdmoSlider } from "./SliderControl";

type EdmoSliderCallback = (type: EdmoProperty, value: number, userAdjusted : boolean) => void;

export class Edmo2DGUI implements IUpdatable {

    private fullscreenUI: AdvancedDynamicTexture;
    private robot: RobotSprite;
    private controlPanel: ControlPanel2D;

    public constructor() {
        this.fullscreenUI = AdvancedDynamicTexture.CreateFullscreenUI("UI 2D", true);
        this.fullscreenUI.addControl(this.controlPanel = new ControlPanel2D());
        this.fullscreenUI.addControl(this.robot = new RobotSprite());
    }

    public onSliderChanged(callback: EdmoSliderCallback) {
        this.controlPanel.onSliderValueChanged(callback);
    }

    public Update(deltaTime: number) {
        this.robot.Update(deltaTime);
        this.controlPanel.Update(deltaTime);
    }

    public UpdateFrequencySlider(value: number) {
        this.controlPanel.UpdateFrequencySlider(value);
    }

    public ShowDisconnectionMessage() {
        this.controlPanel.showDisconnectionMessage();
    }
}

class ControlPanel2D extends ControlPanel implements IUpdatable {

    public constructor() {
        super();

        this.widthInPixels = 600;
        this.paddingRight = 0;
        this.alpha = 1;
        this.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    }

    protected createSlider(property: EdmoProperty, min: number, max: number, step: number, value: number): Control {
        let slider = super.createSlider(property, min, max, step, value) as EdmoSlider;

        const sp = new StackPanel();
        sp.isVertical = false;
        sp.width = 1;
        sp.heightInPixels = 80;

        const rects = new EdmoRectVisual();
        this.Updatables.push(rects);
        slider.onValueChanged((value: number) => rects.adjustProperty(property, value));
        if (property==EdmoProperty.Amplitude){
            rects.frequency=1;
        } else if (property==EdmoProperty.Frequency){
            rects.amplitude=90;
        }

        sp.addControl(rects);
        sp.addControl(slider);

        sp.spacing = 20;

        return sp;
    }
}
