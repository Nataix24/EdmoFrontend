import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";
import { relativeURLWithPort } from "../scripts/API";
import { EdmoProperty } from "./EdmoProperty";
import { RobotSprite2 } from "../scripts/RobotSprite2";
import { FeedbackBubble } from "../scripts/FeedbackBubble";

const panelArea = document.getElementById('panelArea') as HTMLCanvasElement;
const feedbackBubble = document.getElementById('feedbackBubble') as HTMLDivElement;
const robotSprite = document.getElementById('robotSprite') as HTMLDivElement;
const robotSpriteHandler = new RobotSprite2(robotSprite);
const feedbackHandler = new FeedbackBubble(feedbackBubble);


let currentView = 0;

var freq: number = 0;
var amp: number = 0;
var offset: number = 90;
var phaseShift: number = 0;

// Create canvas
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new Engine(canvas);
const scene = new ControllerScene(canvas, engine);
let loadTask = scene.loadAsync();

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});

const hues = [
    0, 120, 240, 60
];

var id = -1;

window.addEventListener('resize', _ => { engine.resize(); scene.Resize(); });
window.addEventListener('beforeunload', _ => edmoClient.close());

const robotID = localStorage.getItem("ConnectTarget") ?? "";
const playerName = localStorage.getItem("ConnectName") ?? "UnnamedPlayer";
const edmoClient = new EDMOClient(playerName, relativeURLWithPort(`controller/${robotID}`, "8080", "ws:"), [handleRTCMessage]);

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
    currentView = 0;
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
    currentView = 1;

    const div = document.createElement("div");
    div.className = "mainContent";

    for (const task of taskList) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("card", "noflex");

        const text = document.createElement("h2");
        text.className = "cardText";
        text.innerText = task.Title;
        taskCard.appendChild(text);
        if (task.Value) //  If it is completed
            text.classList.add("taskCompleted");
        div.appendChild(taskCard);
    }

    panelArea.replaceChildren(createPanelButtons(1), div);
}

function createPlayerPanel() {
    currentView = 2;
    const div = document.createElement("div");
    div.className = "mainContent";

    for (const player of playerList) {
        const playerCard = document.createElement("div");
        playerCard.classList.add("card", "noflex", "playerCard");

        playerCard.style.setProperty("--hue", hues[player.number].toString());

        const text = document.createElement("h2");
        text.className = "cardText";
        text.innerText = `${player.name}${(player.number == id) ? " (You)" : ""}`;
        playerCard.appendChild(text);

        if (player.voted) {
            const icon = document.createElement("i");
            icon.className = `playerCardIcon fa-solid fa-question-circle`;
            playerCard.appendChild(icon);
        }
        div.appendChild(playerCard);
    }

    panelArea.replaceChildren(createPanelButtons(2), div);
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


interface PlayerInfo {
    name: string;
    number: number;
    voted: boolean;
}

interface TaskInfo {
    Title: string;
    Value: boolean;
}

let playerList: PlayerInfo[] = [];
let taskList: TaskInfo[] = [];

//#region RTC messages
async function handleRTCMessage(message: string) {
    const firstSpaceIndex = message.indexOf(' ');

    const instruction = message.substring(0, firstSpaceIndex).trim();
    const data = message.substring(firstSpaceIndex).trim();

    switch (instruction) {
        case "ID":
            id = parseInt(data);
            document.documentElement.style.setProperty('--hue', `${hues[id]}`);

        case "amp":
            onAmplitudeChanged(parseFloat(data), false);

            if (currentView == 0)
                createSliderPanel();
            break;

        case "freq":
            onFrequencyChanged(parseFloat(data), false);

            if (currentView == 0)
                createSliderPanel();
            break;

        case "phb":
            onPhaseShiftChanged(parseFloat(data) / DEG2RADFACTOR, false);

            if (currentView == 0)
                createSliderPanel();
            break;

        case "off":
            onOffsetChanged(parseFloat(data), false);

            if (currentView == 0)
                createSliderPanel();
            break;

        case "TaskInfo":
            taskList = JSON.parse(data);
            // Refresh the tasks panel
            if (currentView == 1)
                createTasksPanel();

            break;

        case "HelpEnabled":
            const enabled = parseInt(data) == 0 ? false : true;
            console.log(enabled);

            enabled ? robotSpriteHandler.show() : robotSpriteHandler.hide();
            break;

        case "Feedback":
            feedbackHandler.show(data);
            break;


        case "PlayerInfo":
            playerList = JSON.parse(data);
            playerList.sort();

            if (currentView == 2)
                createPlayerPanel();

            break;
    }
}
//#endregion

function onFrequencyChanged(value: number, userTriggered = true) {
    freq = value;
    scene.updateEdmoModel(EdmoProperty.Frequency, value);

    if (userTriggered)
        edmoClient.sendMessage(`freq ${value}`);
};

function onAmplitudeChanged(value: number, userTriggered = true) {
    amp = value;
    scene.updateEdmoModel(EdmoProperty.Amplitude, value);

    if (userTriggered)
        edmoClient.sendMessage(`amp ${value}`);
};

function onOffsetChanged(value: number, userTriggered = true) {
    offset = value;
    scene.updateEdmoModel(EdmoProperty.Offset, value);

    if (userTriggered)
        edmoClient.sendMessage(`off ${value}`);

};

function onPhaseShiftChanged(value: number, userTriggered = true) {
    phaseShift = value;
    scene.updateEdmoModel(EdmoProperty.Relation, value);

    if (userTriggered)
        edmoClient.sendMessage(`freq ${Number(value) * DEG2RADFACTOR}`);
};
/* createFeedbackPopUp(true); //instead of true server chcecj if teacher sent feedback 
function createFeedbackPopUp(feedbackSent: boolean){
    //if button is turned on - display pop up with task and turn on robot animation 
    if(feedbackSent){
        const div = document.getElementById('canvasPopUp') as HTMLCanvasElement;
        const feedbackText = document.createElement("p"); 
        feedbackText.textContent="place holder feedback"; //TODO: here fetch the feedback received from the server 
        feedbackText.className="popUpText";
        div.style.display='flex';
        div.appendChild(feedbackText);
        //Set the robot spriter to wave (how do i access robot from here?)
    }
    // if not ignore
} */