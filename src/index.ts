// Generate dynamically group panels in the GroupsPage.html

import { fetchEDMOs } from "./scripts/API";
import { LocalizationManager } from "./scripts/Localization";

const submitButton = document.getElementById("submitButton")!;
const nameInput = (document.getElementById("nameInput") as HTMLInputElement)!;

var edmos: string[] = [];

var currentSelection = "";
var currentName = "";

async function init() {
    nameInput.addEventListener("input", onNameInput);
    submitButton.addEventListener("click", onSubmitAttempt);

    const lastTarget = localStorage.getItem("ConnectTarget") ?? "";
    const lastName = localStorage.getItem("ConnectName") ?? "";
    currentSelection = lastTarget;

    nameInput.value = currentName = lastName;
    refreshGroupData();
}

async function refreshGroupData() {
    edmos = await fetchEDMOs();
    updateGroupsDisplay();
    updateButtonState();
}

async function updateGroupsDisplay() {
    const contentDiv = document.getElementById('creatingGroupPanels');

    if (!contentDiv)
        return;

    if (edmos.length === 0) {
        const placeholderText = document.createElement("h2");

        placeholderText.innerText = "No edmos are active at this moment.";
        LocalizationManager.setLocalisationKey(placeholderText, "noActiveEdmos");

        contentDiv.replaceChildren(placeholderText);
        return;
    }

    var newChildren: Node[] = [];

    // Loop through all the groups 0 - n

    var selectionFound = false;
    edmos.forEach(robotID => {
        const groupCard = document.createElement('div');
        groupCard.classList.add('card', "groupCard");
        groupCard.id = robotID;

        if (robotID == currentSelection) {
            selectionFound = true;
            groupCard.classList.add("selected");
        }

        groupCard.addEventListener("click", onEDMOSelected);

        const robotNameTag = document.createElement('h1');
        robotNameTag.innerHTML = robotID;
        robotNameTag.id = robotID;

        groupCard.appendChild(robotNameTag);

        newChildren.push(groupCard);
    });

    if (!selectionFound)
        currentSelection = "";

    contentDiv.replaceChildren(...newChildren);
}

async function onEDMOSelected(e: MouseEvent) {
    const target = (e.target as HTMLElement);

    if (currentSelection == target.id)
        currentSelection = "";
    else
        currentSelection = target.id;

    updateGroupsDisplay();
    updateButtonState();
}

async function onNameInput(e: Event) {
    const target = (e.target as HTMLInputElement);

    currentName = target.value;
    updateButtonState();

}

function updateButtonState() {
    submitButton.style.opacity = (!currentName || !currentSelection) ? "0.2" : "1";
}
async function onSubmitAttempt(e: Event) {
    if (!currentSelection || !currentName)
        return;

    localStorage.setItem("ConnectTarget", currentSelection);
    localStorage.setItem("ConnectName", currentName);

    window.location.assign("/controller.html");
}

await init();
await LocalizationManager.loadLocalisationBanks("strings/controllerStrings.json");

setInterval(refreshGroupData, 5000);




