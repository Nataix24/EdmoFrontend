import { EventState } from "@babylonjs/core";
import { Slider, StackPanel, TextBlock } from "@babylonjs/gui";

type SliderChangedCallback = (newValue: number) => void;

export class EdmoSlider extends StackPanel {
    private valueLabel: TextBlock;
    private slider: Slider;
    private callbacks: SliderChangedCallback[] = [];

    public constructor(label: string, min: number, max: number, step: number, value: number = 0) {
        super();

        this.isVertical = true;

        let header = new TextBlock(`EdmoSlider (${label}) label`, label);
        header.heightInPixels = 30;
        header.fontSizeInPixels = 25;
        header.fontWeight = "Bold";
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
        this.valueLabel.text = newValue.toFixed(1).toString();
        this.callbacks.forEach(c => c(newValue));
    }

    public onValueChanged(callback: SliderChangedCallback) {
        this.callbacks.push(callback);
    }

    get Value() {
        return this.slider.value;
    }
    set Value(value: number) {
        this.slider.value = value;
    }
}
