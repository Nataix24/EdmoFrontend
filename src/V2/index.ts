import { Engine } from "@babylonjs/core";
import { ControllerScene } from "./ControllerScene";
import { EDMOClient } from "../EDMOClient";

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
canvas.style.height = "100vh"
canvas.style.width = "100vw"

const engine = new Engine(canvas);

const edmoClient = new EDMOClient("ws://192.168.65.246:8080");

await edmoClient.waitForId(3000);

const scene = new ControllerScene(false, edmoClient, canvas, engine);

engine.runRenderLoop(() => {
    scene.Update();
    scene.render();
});

window.addEventListener('resize', function () {
    engine.resize();
});