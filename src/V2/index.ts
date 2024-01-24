import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
canvas.style.height = "100vh";
canvas.style.width = "100vw";


const lastUsedWebsocket = document.cookie.replace(/(?:(?:^|.*;\s*)websocket\s*\=\s*([^;]*).*$)|^.*$/, "$1");

var userInput: string | null;
while (true) {

    // Ask the user for input using a popup
    userInput = window.prompt("Please enter the server websocket address", lastUsedWebsocket);

    if (userInput?.startsWith("ws://") || userInput?.startsWith("wss://"))
        break;
}

// Cache the input in cookies
document.cookie = `websocket=${userInput}`;

const engine = new Engine(canvas);

const edmoClient = new EDMOClient(userInput);

await edmoClient.waitForId(3000);

const scene = new ControllerScene(edmoClient.simpleMode, edmoClient, canvas, engine);

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});
