import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";
import { relativeURLWithPort } from "../scripts/API";
import { EdmoProperty } from "./EdmoProperty";

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;

const robotID = localStorage.getItem("ConnectTarget") ?? "";

const engine = new Engine(canvas);

const edmoClient = new EDMOClient(relativeURLWithPort(`controller/${robotID}`, "8080", "ws:"));

await edmoClient.waitForId(10000);

const scene = new ControllerScene(canvas, engine);

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});


window.addEventListener('resize', function () {
    engine.resize();
});

window.addEventListener('beforeunload', function (e) {
    //e.preventDefault();
    edmoClient.close();
});


const freqSlider = document.getElementById('freqSlider') as HTMLInputElement;
const freqText = document.getElementById("freqInputText") as HTMLInputElement;
freqSlider.addEventListener("input", onFrequencyChanged);
freqText.addEventListener("input", onFrequencyChanged);

const ampSlider = document.getElementById('ampSlider') as HTMLInputElement;
const ampText = document.getElementById("ampInputText") as HTMLInputElement;
ampSlider.addEventListener("input", onAmplitudeChanged);
ampText.addEventListener("input", onAmplitudeChanged);

const offsetSlider = document.getElementById('offsetSlider') as HTMLInputElement;
const offsetText = document.getElementById("offsetInputText") as HTMLInputElement;
offsetSlider.addEventListener("input", onOffsetChanged);
offsetText.addEventListener("input", onOffsetChanged);

const phaseSlider = document.getElementById('phaseSlider') as HTMLInputElement;
const phaseText = document.getElementById("phaseInputText") as HTMLInputElement;
phaseSlider.addEventListener("input", onPhaseShiftChanged);
phaseText.addEventListener("input", onPhaseShiftChanged);

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

function onFrequencyChanged(e: Event) {
    const value = clamp((e.target as HTMLInputElement).value, 0, 2);

    freqSlider.value = freqText.value = value.toString();

    edmoClient.sendMessage(`freq ${value}`);
    scene.updateEdmoModel(EdmoProperty.Frequency, value);
};
function onAmplitudeChanged(e: Event) {
    const value = clamp((e.target as HTMLInputElement).value, 0, 90);
    ampSlider.value = ampText.value = value.toString();

    edmoClient.sendMessage(`amp ${value}`);
    scene.updateEdmoModel(EdmoProperty.Amplitude, value);
};
function onOffsetChanged(e: Event) {
    const value = clamp((e.target as HTMLInputElement).value, 0, 180);
    offsetSlider.value = offsetText.value = value.toString();


    scene.updateEdmoModel(EdmoProperty.Offset, value);
    edmoClient.sendMessage(`off ${value}`);
};
function onPhaseShiftChanged(e: Event) {
    const value = clamp((e.target as HTMLInputElement).value, 0, 360);

    phaseSlider.value = phaseText.value = value.toString();

    edmoClient.sendMessage(`freq ${Number(value) * DEG2RADFACTOR}`);
    scene.updateEdmoModel(EdmoProperty.Relation, value);
};

