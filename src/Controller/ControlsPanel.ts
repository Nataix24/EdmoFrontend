import { LocalizationManager } from "../scripts/Localization";
import { Panel } from "./Panel";
import { RelationWheel } from "./RotationWheel";


export interface ControlPanelCallbacks {
    frequencyChangedCallback: (x: number) => void;
    amplitudeChangedCallback: (x: number) => void;
    offsetChangedCallback: (x: number) => void;
    phaseShiftChangedCallback: (x: number) => void;
    helpButtonClicked: (x: boolean) => void;
}

export class ControlPanel extends Panel {
    private readonly callbacks: ControlPanelCallbacks;
    private readonly helpButton: HTMLDivElement;

    private helpRequested: boolean = false;

    private freqSlider: Slider = null!;
    private ampSlider: Slider = null!;
    private offsetSlider: Slider = null!;
    private phaseShiftSlider: RelationWheel = null!;

    public constructor(parent: HTMLElement | null, callbacks: ControlPanelCallbacks) {
        super(parent);
        this.callbacks = callbacks;

        this.element.className = "mainContent";

        this.element.replaceChildren(
            this.helpButton = this.createHelpButton(),
            this.createSliders()
        );
    }
    private id = -1;
    public setID(id: number) {
        this.id = id;
        this.phaseShiftSlider.setID(id);
    }

    public showHelpButton() {
        this.helpButton.classList.remove("buttonHidden", "selected");
    }

    public hideHelpButton() {
        this.helpRequested = false;
        this.helpButton.classList.add("buttonHidden");
    }

    private toggleHelp() {
        if (this.helpRequested)
            this.unrequestHelp();
        else
            this.requestHelp();

        this.callbacks.helpButtonClicked(this.helpRequested);
    }

    private unrequestHelp() {
        this.helpRequested = false;
        this.helpButton.classList.remove("selected");
        this.helpButton.innerText = "Request help";
        LocalizationManager.setLocalisationKey(this.helpButton, "requestHelp");

    }
    private requestHelp() {
        this.helpRequested = true;
        this.helpButton.classList.add("selected");
        this.helpButton.innerText = "Unrequest help";
        LocalizationManager.setLocalisationKey(this.helpButton, "unrequestHelp");
    }

    public highlight(sliderTitle: string) {
        switch (sliderTitle) {
            case "frequency":
                this.freqSlider.highlight();
                break;
            case "amplitude":
                this.ampSlider.highlight();
                break;
            case "offset":
                this.offsetSlider.highlight();
                break;
            case "relation":
                this.phaseShiftSlider.highlight();
                break;
        }
    }

    set frequency(x: number) {
        this.freqSlider.value = x;
    }

    set amplitude(x: number) {
        this.ampSlider.value = x;
    }

    set offset(x: number) {
        this.offsetSlider.value = x;
    }
    public setPhaseShift(index: number, x: number) {
        this.phaseShiftSlider.setValueOf(index, x);
    }

    private createHelpButton() {
        const div = document.createElement("div");
        div.className = "card noflex buttonHidden bigText";
        div.innerText = "Request help";
        div.style.padding = "1em";
        LocalizationManager.setLocalisationKey(div, "requestHelp");

        div.addEventListener("click", _ => this.toggleHelp());
        return div;
    }

    private createSliders() {

        const div = document.createElement("div");
        div.className = "slidersContainer";

        fetch("configs/controllerConfigs.json").then(
            async x => {
                const lines = (await x.text()).split("\n").filter(s=>!s.startsWith("//")).join(("\n"));

                const ranges = JSON.parse(lines)

                

                const freqConf = ranges["frequency"];
                const offsetConf = ranges["offset"];
                const ampConf = ranges["amplitude"];


                div.replaceChildren(
                    (this.freqSlider = new Slider("Frequency", 0, freqConf["min"], freqConf["max"], freqConf["step"], this.callbacks.frequencyChangedCallback)).element,
                    (this.ampSlider = new Slider("Amplitude", 0, ampConf["min"], ampConf["max"], ampConf["step"], this.callbacks.amplitudeChangedCallback)).element,
                    (this.offsetSlider = new Slider("Offset", 90, offsetConf["min"], offsetConf["max"], offsetConf["step"], this.callbacks.offsetChangedCallback)).element,
                    (this.phaseShiftSlider = new RelationWheel(this.callbacks.phaseShiftChangedCallback)).element,
                    this.createResetButton()
                );

                const spacer = document.createElement("div");
                spacer.className = "spacer";
            }
        );

        return div;
    }

    private createResetButton() {
        const div = document.createElement("div");
        div.className = "card noflex bigText";
        div.style.marginTop = "1em";
        div.innerText = "Reset sliders";
        div.style.padding = "1em";
        LocalizationManager.setLocalisationKey(div, "resetSliders");

        div.addEventListener("click", _ => this.resetValues());
        return div;
    }

    private resetValues() {
        this.callbacks.frequencyChangedCallback(this.frequency = 0);
        this.callbacks.amplitudeChangedCallback(this.amplitude = 0);
        this.callbacks.offsetChangedCallback(this.offset = 90);
        this.setPhaseShift(this.id, 0);
        this.callbacks.phaseShiftChangedCallback(0);
    }
}

class Slider {
    private slider: HTMLInputElement;
    private text: HTMLInputElement;
    public element: HTMLElement;

    private highlightInterval: any;

    public constructor(title: string, value: number, min: number, max: number, step: number, valueChangedCallback: (x: number) => void) {
        const element = this.element = document.createElement("div");
        element.style.animationDuration = "5000ms";

        const header = document.createElement("h2");
        header.innerText = title;
        LocalizationManager.setLocalisationKey(header, title.toLowerCase());


        element.appendChild(header);

        const sliderBox = document.createElement("div");
        sliderBox.className = "sliderbox";
        element.appendChild(sliderBox);

        const slider = this.slider = document.createElement("input");
        slider.type = "range";
        slider.className = "slider";

        const inputDiv = document.createElement("div");
        inputDiv.className = "textBox sliderinput";

        const inputText = this.text = document.createElement("input");
        inputText.type = "number";
        inputText.classList.add("sliderinputText", "textBoxInput");
        inputText.autocomplete = "off";
        inputDiv.appendChild(inputText);

        slider.min = inputText.min = min.toString();
        slider.max = inputText.max = max.toString();
        slider.step = inputText.step = step.toString();
        slider.value = inputText.value = value.toString();

        const onValueChanged = (e: Event) => {
            const value = Slider.clamp((e.target as HTMLInputElement).value, min, max);

            this.value = value;

            valueChangedCallback(value);
        };

        slider.addEventListener("input", onValueChanged);
        inputText.addEventListener("input", onValueChanged);

        sliderBox.replaceChildren(slider, inputDiv);
        this.element.replaceChildren(header, sliderBox);
    }

    private static clamp(value: string, min: number, max: number) {
        try {
            let num = Number(value);

            if (isNaN(num)) {
                return min;
            }

            return Math.max(Math.min(num, max));
        } catch (error) {
            return min;
        }
    }

    public highlight() {
        if (this.highlightInterval)
            this.unhighlight();

        this.element.style.animationName = "highlight";
        this.highlightInterval = setInterval(this.unhighlight.bind(this), 5000);
    }
    public unhighlight() {
        this.element.style.animationName = "";
        clearInterval(this.highlightInterval);
        this.highlightInterval = null;
    }

    set value(x: number) {
        this.slider.value = this.text.value = x.toString();
    }
}