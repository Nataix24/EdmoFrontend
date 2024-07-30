import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
canvas.style.height = "100vh";
canvas.style.width = "100vw";

const lastUsedWebsocket = document.cookie.replace(/(?:(?:^|.*;\s*)websocket\s*\=\s*([^;]*).*$)|^.*$/, "$1");

var userInput = window.prompt("Please enter the client name");

document.cookie = `websocket=${userInput}`;

const engine = new Engine(canvas);
const edmoClient = new EDMOClient("ws://192.168.123.62:8080/controller/" + userInput);


await edmoClient.waitForId(10000);

const scene = new ControllerScene(true, edmoClient, canvas, engine);

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});

window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    edmoClient.close();
});
