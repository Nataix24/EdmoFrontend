import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";
import { relativeURLWithPort } from "../scripts/API";
import { EdmoProperty } from "./EdmoProperty";

const panelArea = document.getElementById('panelArea') as HTMLCanvasElement;

var freq: number = 0;
var amp: number = 0;
var offset: number = 90;
var phaseShift: number = 0;

// Create canvas
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = new ControllerScene(canvas, engine);

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});

window.addEventListener('resize', _ => engine.resize());
window.addEventListener('beforeunload', _ => edmoClient.close());

const robotID = localStorage.getItem("ConnectTarget") ?? "";
const playerName = localStorage.getItem("ConnectName") ?? "UnnamedPlayer"
const edmoClient = new EDMOClient(playerName, relativeURLWithPort( `controller/${robotID}`, "8080", "ws:"));

function createPanelButtons(currentPanel: number) {
    const div = document.createElement("div");
    div.className = "panelButtons";

    div.replaceChildren(
        createButton("fa-gamepad", currentPanel == 0, createSliderPanel),
        createButton("fa-list", currentPanel == 1, createTasksPanel),
        createButton("fa-user-group", currentPanel == 2, createPlayerPanel));
    return div;
}

function createButton(iconName: string, isSelected: boolean, onClickCallback: () => void) {
    const div = document.createElement("div");
    div.className = "panelButton";

    if (isSelected)
        div.classList.add("panelButtonSelected");

    const icon = document.createElement("i");
    icon.className = `panelButtonIcon  fa-solid ${iconName}`;

    div.appendChild(icon);
    div.addEventListener("click", _ => onClickCallback());

    return div;
}

function createSliderPanel() {
    const div = document.createElement("div");
    div.className = "slidersContainer";

    div.replaceChildren(
        createSlider("Frequency", freq, 0, 2, 0.05, onFrequencyChanged),
        createSlider("Amplitude", amp, 0, 90, 1, onAmplitudeChanged),
        createSlider("Offset", offset, 0, 180, 1, onOffsetChanged),
        createSlider("Relation", phaseShift, 0, 360, 1, onPhaseShiftChanged),
    );

    const spacer = document.createElement("div");
    spacer.className = "spacer";

    panelArea.replaceChildren(createPanelButtons(0), div, spacer);
}

function createTasksPanel() {
    panelArea.replaceChildren(createPanelButtons(1));
}

function createPlayerPanel() {
    panelArea.replaceChildren(createPanelButtons(2));
}

function createSlider(title: string, value: number, min: number, max: number, step: number, valueChangedCallback: (x: number) => void) {
    const div = document.createElement("div");

    const header = document.createElement("h2");
    header.innerText = title;
    div.appendChild(header);

    const sliderBox = document.createElement("div");
    sliderBox.className = "sliderbox";
    div.appendChild(sliderBox);

    //<input type="range" min="0" max="2" step="0.05" value="0" class="slider" id="freqSlider">
    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "slider";

    const inputDiv = document.createElement("div");
    inputDiv.className = "textBox sliderinput";

    const inputText = document.createElement("input");
    inputText.type = "number";
    inputText.classList.add("sliderinputText", "textBoxInput");
    inputText.autocomplete = "off";
    inputDiv.appendChild(inputText);

    slider.min = inputText.min = min.toString();
    slider.max = inputText.max = max.toString();
    slider.step = inputText.step = step.toString();
    slider.value = inputText.value = value.toString();

    function onValueChanged(e: Event) {
        const value = clamp((e.target as HTMLInputElement).value, min, max);

        slider.value = inputText.value = value.toString();

        valueChangedCallback(value);
    }

    slider.addEventListener("input", onValueChanged);
    inputText.addEventListener("input", onValueChanged);

    sliderBox.replaceChildren(slider, inputDiv);
    div.replaceChildren(header, sliderBox);

    return div;
}

createSliderPanel();

const DEG2RADFACTOR = Math.PI / 180;

function clamp(value: string, min: number, max: number) {
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

function onFrequencyChanged(value: number) {
    freq = value;
    edmoClient.sendMessage(`freq ${value}`);
    scene.updateEdmoModel(EdmoProperty.Frequency, value);
};

function onAmplitudeChanged(value: number) {
    amp = value;
    edmoClient.sendMessage(`amp ${value}`);
    scene.updateEdmoModel(EdmoProperty.Amplitude, value);
};

function onOffsetChanged(value: number) {
    offset = value;
    scene.updateEdmoModel(EdmoProperty.Offset, value);
    edmoClient.sendMessage(`off ${value}`);
};

function onPhaseShiftChanged(value: number) {
    phaseShift = value;
    edmoClient.sendMessage(`freq ${Number(value) * DEG2RADFACTOR}`);
    scene.updateEdmoModel(EdmoProperty.Relation, value);
};

