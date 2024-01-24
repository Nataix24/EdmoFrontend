
import { Button, Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { EdmoSlider } from "./SliderControl";
import { EdmoProperty } from "./EdmoProperty";
import { IUpdatable } from "./IUpdatable";
import { Color3 } from "@babylonjs/core";

type EdmoSliderCallback = (type: EdmoProperty, value: number, userAdjusted : boolean) => void;

export class ControlPanel extends Rectangle implements IUpdatable {
    private sliders = new Map<EdmoProperty, EdmoSlider>();
    protected Updatables: IUpdatable[] = [];

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


        let stackPanel = new StackPanel();

        stackPanel.height = stackPanel.width = 1;
        stackPanel.isVertical = true;
        stackPanel.setPaddingInPixels(10);
        stackPanel.paddingTopInPixels = 50;
        stackPanel.spacing = 20;

        stackPanel.addControl(this.createSlider(EdmoProperty.Frequency, 0, 5, 0.1, 0));
        stackPanel.addControl(this.createSlider(EdmoProperty.Offset, 0, 180, 1, 90));
        stackPanel.addControl(this.createSlider(EdmoProperty.Amplitude, 0, 90, 1, 0));
        stackPanel.addControl(this.createSlider(EdmoProperty.Relation, 0, 360, 1, 0));

        stackPanel.addControl(this.createButton());

        this.addControl(stackPanel);
    }

    Update(deltaTime: number): void {
        this.Updatables.forEach(e => e.Update(deltaTime));
    }

    private createButton() {
        let button = Button.CreateSimpleButton("Reset button", "");
        button.heightInPixels = 50;
        button.setPaddingInPixels(10);
        button.cornerRadius = 10;
        button.color = "#4e3650ff";
        button.background = "#4e3650ff";

        // Create a text block for the button
        var textBlock = new TextBlock();
        textBlock.text = "Reset Values";
        textBlock.color = "#FFFFFF"; // Text color of the button
        button.addControl(textBlock);

        button.onPointerClickObservable.add((_, __) => this.resetSliders());
        return button;
    }

    protected createSlider(property: EdmoProperty, min: number, max: number, step: number, value: number): Control {
        let slider = new EdmoSlider(EdmoProperty[property], min, max, step, value);
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
        // Taking a bold "risk", and assuming that everything is non-null in the map
        this.sliders.get(EdmoProperty.Offset)!.Value = 90;
        this.sliders.get(EdmoProperty.Frequency)!.Value = 0;
        this.sliders.get(EdmoProperty.Amplitude)!.Value = 0;
        this.sliders.get(EdmoProperty.Relation)!.Value = 0;
    }

    private callbacks: EdmoSliderCallback[] = [];

    private sliderUpdated(type: EdmoProperty, value: number, userAdjusted : boolean) {
        this.callbacks.forEach(c => c(type, value, userAdjusted));
    }

    public onSliderValueChanged(callback: EdmoSliderCallback) {
        this.callbacks.push(callback);
    }
}
