import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";
import { relativeURLWithPort } from "../scripts/API";

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
canvas.style.height = "100vh";
canvas.style.width = "100vw";


const robotID = localStorage.getItem("ConnectTarget") ?? "";

const engine = new Engine(canvas);
const edmoClient = new EDMOClient(relativeURLWithPort(`controller/${robotID}`, "8080", "ws:"));

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
