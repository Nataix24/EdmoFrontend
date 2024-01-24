import { EventState } from "@babylonjs/core";
import { Slider, StackPanel, TextBlock } from "@babylonjs/gui";

type SliderChangedCallback = (newValue: number, userAdjusted: boolean) => void;

export class EdmoSlider extends StackPanel {
    private valueLabel: TextBlock;
    private slider: Slider;
    private callbacks: SliderChangedCallback[] = [];

    private precision: number;
    private defaultValue: number;

    public constructor(label: string, min: number, max: number, step: number, value: number = 0, precision = 2) {
        super();

        this.isVertical = true;
        this.precision = precision;
        this.defaultValue = value;

        let header = new TextBlock(`EdmoSlider (${label}) label`, label);
        header.heightInPixels = 30;
        header.fontSizeInPixels = 25;
        header.fontWeight = "Bold";
        header.color = "#FFFFFF";
        this.addControl(header);
        let slider = this.slider = new Slider(`EdmoSlider (${label}) slider`);

        slider.minimum = min;
        slider.maximum = max;
        slider.step = step;
        slider.widthInPixels = 250;
        slider.background = "#4e3650ff";
        slider.color = "#512858ff";
        slider.value = value;

        this.valueLabel = new TextBlock(`EdmoSlider (${label}) value`, value.toString());
        this.valueLabel.widthInPixels = 50;
        this.valueLabel.color = "#FFFFFF";

        let sliderArea = new StackPanel();
        sliderArea.isVertical = false;
        sliderArea.addControl(slider);
        sliderArea.addControl(this.valueLabel);
        sliderArea.heightInPixels = 40;

        slider.onValueChangedObservable.add(this.valueChanged.bind(this));

        this.addControl(sliderArea);
        this.heightInPixels = 70;
    }

    private valueChanged(newValue: number, eventState: EventState) {
        this.valueLabel.text = newValue.toFixed(this.precision).toString();
        this.callbacks.forEach(c => c(newValue, !this._manuallySetting));
    }

    public onValueChanged(callback: SliderChangedCallback) {
        this.callbacks.push(callback);
    }

    public Reset() {
        this.slider.value = this.defaultValue;
    }

    get Value() {
        return this.slider.value;
    }

    private _manuallySetting = false;

    set Value(value: number) {
        if (this.slider.value == value)
            return;

        this._manuallySetting = true; // Lets not create a cycle of comms

        this.slider.value = value;

        this._manuallySetting = false;
    }

    public setColorSlider(backgroundColor: string, fillColor: string) {
        this.slider.color = fillColor;
        this.slider.background = backgroundColor;
    }
}
