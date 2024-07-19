
import { Button, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { EdmoSlider } from "./SliderControl";
import { EdmoProperty } from "./EdmoProperty";
import { IUpdatable } from "./IUpdatable";
import { Color3 } from "@babylonjs/core";

type EdmoSliderCallback = (type: EdmoProperty, value: number, userAdjusted: boolean) => void;

export class ControlPanel extends Rectangle implements IUpdatable {
    private sliders = new Map<EdmoProperty, EdmoSlider>();
    protected Updatables: IUpdatable[] = [];
    private disconnectionMessage: TextBlock;

    public constructor() {
        super("Control Panel");

        this.widthInPixels = 400;
        this.heightInPixels = 600;
        this.alpha = 0.75;
        this.background = "#9C5586";
        this.color = "#9C5586";
        this.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.paddingRight = 40;
        this.cornerRadius = 50;

        let stackPanel : StackPanel = new StackPanel();

        stackPanel.height = stackPanel.width = 1;
        stackPanel.isVertical = true;
        stackPanel.setPaddingInPixels(10);
        stackPanel.paddingTopInPixels = 50;
        stackPanel.spacing = 20;

        stackPanel.addControl(this.createSlider(EdmoProperty.Frequency, 0, 2, 0.01, 0));
        stackPanel.addControl(this.createGap(5));
        stackPanel.addControl(this.createSlider(EdmoProperty.Offset, 0, 180, 1, 90, 0));
        stackPanel.addControl(this.createSlider(EdmoProperty.Amplitude, 0, 90, 1, 0, 0));
        stackPanel.addControl(this.createSlider(EdmoProperty.Relation, 0, 360, 1, 0, 0));

        stackPanel.addControl(this.createButton());

        stackPanel.addControl(this.disconnectionMessage = this.createDisconnectionMessage());

        this.addControl(stackPanel);
    }

    Update(deltaTime: number): void {
        this.Updatables.forEach(e => e.Update(deltaTime));
    }


    private createGap(height: number = 10) {
        const box = new Rectangle("Gap");
        box.heightInPixels = height;
        box.alpha = 0;
        box.width = 1;
        return box;
    }

    private createDisconnectionMessage() {
        let message = new TextBlock("disconnection message", "You have been disconnected from the server");
        message.color = "#FFFFFF";
        message.fontSize = 20;
        message.heightInPixels = 50;
        message.width = 1;
        message.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        message.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        message.alpha = 0;
        return message;
    }

    private createButton() {
        let button = Button.CreateSimpleButton("Reset button", "Reset Values");
        button.heightInPixels = 50;
        button.setPaddingInPixels(10);
        button.cornerRadius = 10;
        button.color = "#4e3650ff";
        button.background = "#4e3650ff";

        // We can assert that textblock cannot be null, since we just created it
        button.textBlock!.color = "#FFFFFF"; // Text color of the button

        button.onPointerClickObservable.add((_, __) => this.resetSliders());
        return button;
    }

    protected createSlider(property: EdmoProperty, min: number, max: number, step: number, value: number, precision: number = 2): Control {
        let slider = new EdmoSlider(EdmoProperty[property], min, max, step, value, precision);
        slider.onValueChanged((v, u) => this.sliderUpdated(property, v, u));
        if (property == EdmoProperty.Frequency) {
            slider.setColorSlider("#4e3650ff", "#5188AE");
        }
        this.sliders.set(property, slider);

        return slider;
    }

    public UpdateFrequencySlider(frequency: number) {
        this.sliders.get(EdmoProperty.Frequency)!.Value = frequency;
    }

    private resetSliders() {
        this.sliders.forEach(s => s.Reset());
    }

    private callbacks: EdmoSliderCallback[] = [];

    private sliderUpdated(type: EdmoProperty, value: number, userAdjusted: boolean) {
        this.callbacks.forEach(c => c(type, value, userAdjusted));
    }

    public onSliderValueChanged(callback: EdmoSliderCallback) {
        this.callbacks.push(callback);
    }

    public showDisconnectionMessage() {
        this.disconnectionMessage.alpha = 1;
    }
}
