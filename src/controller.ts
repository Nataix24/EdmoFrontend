import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./V2/ControllerScene";
import { EDMOClient } from "./EDMOClient";
import { relativeURLWithPort } from "./scripts/API";
import { EdmoProperty } from "./V2/EdmoProperty";
import { RobotSprite2 } from "./scripts/RobotSprite2";
import { FeedbackBubble } from "./scripts/FeedbackBubble";
import { ControlPanel } from "./Controller/ControlsPanel";
import { PanelButtons } from "./Controller/PanelButtons";
import { TaskPanel } from "./Controller/TasksPanel";
import { PlayersPanel } from "./Controller/PlayersPanel";
import { BloomSprite } from "./scripts/BloomSprite";
import { LocalizationManager } from "./scripts/Localization";

await LocalizationManager.loadLocalisationBanks("/strings/controllerStrings.json")

const robotID = localStorage.getItem("ConnectTarget") ?? "";
const playerName = localStorage.getItem("ConnectName") ?? "UnnamedPlayer";

const panelArea = document.getElementById('panelArea') as HTMLCanvasElement;
const feedbackBubble = document.getElementById('feedbackBubble') as HTMLDivElement;
const taskBubble = document.getElementById('taskBubble') as HTMLDivElement;
const robotSprite = document.getElementById('robotSprite') as HTMLDivElement;
const robotSpriteHandler = playerName.toLowerCase() == "bloom" ? new BloomSprite(robotSprite) : new RobotSprite2(robotSprite);
const feedbackHandler = new FeedbackBubble(feedbackBubble);

const canvasContainer = document.getElementById("canvasContainer") as HTMLCanvasElement;
const controllerContainer = document.getElementById("controllerContainer") as HTMLCanvasElement;

var helpEnabled: boolean = false;

const panelButtons = new PanelButtons([
    { faIcon: "fa-gamepad", selectionCallback: () => createSliderPanel() },
    { faIcon: "fa-list", selectionCallback: () => createTasksPanel() },
    { faIcon: "fa-user-group", selectionCallback: () => createPlayerPanel() },
]);

const controlPanel = new ControlPanel(null, {
    frequencyChangedCallback: onFrequencyChanged,
    amplitudeChangedCallback: onAmplitudeChanged,
    offsetChangedCallback: onOffsetChanged,
    phaseShiftChangedCallback: onPhaseShiftChanged,
    helpButtonClicked: toggleVote
});

const taskPanel = new TaskPanel(taskBubble);
const playersPanel = new PlayersPanel();

interface PlayerInfo {
    name: string;
    number: number;
    voted: boolean;
}

let playerList: PlayerInfo[] = [];

// Create canvas
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const scene = new ControllerScene(canvas);
let loadTask = scene.loadAsync();

const hues = [
    0, 120, 240, 60
];

var id = -1;


const edmoClient = new EDMOClient(playerName, relativeURLWithPort(`controller/${robotID}`, "8080", "ws:"), [handleRTCMessage]);


function createTasksPanel() {
    panelArea.replaceChildren(panelButtons.element, taskPanel.element);
}

function createPlayerPanel() {
    panelArea.replaceChildren(panelButtons.element, playersPanel.element);
}

function createSliderPanel() {
    panelArea.replaceChildren(panelButtons.element, controlPanel.element);
}

createSliderPanel();

const DEG2RADFACTOR = Math.PI / 180;

//#region RTC messages
async function handleRTCMessage(message: string) {
    const firstSpaceIndex = message.indexOf(' ');

    const instruction = message.substring(0, firstSpaceIndex).trim();
    const data = message.substring(firstSpaceIndex).trim();

    switch (instruction) {
        case "ID":
            id = parseInt(data);
            document.documentElement.style.setProperty('--hue', `${hues[id]}`);
            playersPanel.setID(id);
            break;

        case "amp": {
            const value = parseFloat(data);
            controlPanel.amplitude = value;
            onAmplitudeChanged(value, false);
            break;
        }

        case "freq": {
            const value = parseFloat(data);
            controlPanel.frequency = value;
            onFrequencyChanged(value, false);
            break;
        }

        case "phb": {
            const value = parseFloat(data) / DEG2RADFACTOR;
            controlPanel.phaseShift = value;
            onPhaseShiftChanged(value, false);
            break;
        }

        case "off": {
            const value = parseFloat(data);
            controlPanel.offset = value;
            onOffsetChanged(value, false);
            break;
        }

        case "TaskInfo":
            const taskList = JSON.parse(data);
            taskPanel.refreshTasks(taskList);

            break;

        case "HelpEnabled":
            helpEnabled = parseInt(data) == 0 ? false : true;

            if (helpEnabled) {
                robotSpriteHandler.show();
                controlPanel.showHelpButton();
            }
            else {
                robotSpriteHandler.hide();
                controlPanel.hideHelpButton();
            }

            break;
        case "SimpleMode":
            const simpleMode = parseInt(data) == 0 ? false : true;

            setSimpleMode(simpleMode);
            break;

        case "Feedback":
            feedbackHandler.show(data);
            robotSpriteHandler.speak();
            break;


        case "PlayerInfo":
            playerList = JSON.parse(data);
            playerList.sort();

            playersPanel.refreshPlayers(playerList);

            break;
    }
}

function toggleVote() {
    edmoClient.sendMessage(`vote ${getCurrentPlayerInfo()?.voted ? 0 : 1}`);
}

function getCurrentPlayerInfo() {
    for (const playerInfo of playerList)
        if (playerInfo.number == id)
            return playerInfo;
}
//#endregion

function onFrequencyChanged(value: number, userTriggered = true) {
    scene.updateEdmoModel(EdmoProperty.Frequency, value);

    if (userTriggered)
        edmoClient.sendMessage(`freq ${value}`);
};

function onAmplitudeChanged(value: number, userTriggered = true) {
    scene.updateEdmoModel(EdmoProperty.Amplitude, value);

    if (userTriggered)
        edmoClient.sendMessage(`amp ${value}`);
};

function onOffsetChanged(value: number, userTriggered = true) {
    scene.updateEdmoModel(EdmoProperty.Offset, value);

    if (userTriggered)
        edmoClient.sendMessage(`off ${value}`);

};

function onPhaseShiftChanged(value: number, userTriggered = true) {
    scene.updateEdmoModel(EdmoProperty.Relation, value);

    if (userTriggered)
        edmoClient.sendMessage(`phb ${Number(value) * DEG2RADFACTOR}`);
};

function setSimpleMode(value: boolean) {
    if (!value) {
        canvasContainer.classList.remove("simple");
        canvas.classList.remove("simple");
        controllerContainer.classList.remove("simple");
    }
    else {
        canvasContainer.classList.add("simple");
        canvas.classList.add("simple");
        controllerContainer.classList.add("simple");
    }
}