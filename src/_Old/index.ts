// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { EDMOClient } from '../EDMOClient';
import {Animatable, Color3, EasingFunction} from '@babylonjs/core';
//importing GUI customized classes
import { GUIManager} from "./GUIComponents/GUIMenager";
import { RectangleFactory } from './GUIComponents/RecrangleFactory';
import { LabelFactory } from './GUIComponents/LabelFactory';
import { SliderFactory } from "./GUIComponents/SliderFactory";
import { RobotTaskFactory} from "./GUIComponents/RobotTaskFactory";
import { ModelFactory3D} from "./GUIComponents/ModelFactory3D";

// Create an instance of imported gui classes
const rectangleMenu = new RectangleFactory(400, "600px", 0, 0, "#9C5586FF");
const button = new RectangleFactory(150, "50px", 0, 0, "#4E3650FF");

// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);
const client = new EDMOClient("ws://192.168.65.246:8080");
// Connection status
var connect = false;
// Set connection status
function setConnectSuccess() {
  connect = true;
}
// Function to refresh the webpage
function refreshPage() {
  location.reload(); // Pass true to force a reload from the server, ignoring the cache
}
/**
 *This funciton handles first - 3D model Rendering and second - GUI elements in 2D space
 */
const createScene = async function () {
  //Define a scene
  const scene = new BABYLON.Scene(engine);

  /**
   * 3D Element Rendering on web
   */
  //Defining a light and camera for the 3D scene
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  var camera = new BABYLON.ArcRotateCamera("Camera", 0.4, 0.9, 260, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, false);

  const model = new ModelFactory3D(scene);
  // Due to asynchronous nature of the createModel method. When you assign importedModel outside the createModel callback,
  // it's likely being assigned before the asynchronous operation is complete. Which causes it to be unidentified
  // To fix this issue we work with Promise
  const modelPromise = new Promise<BABYLON.AbstractMesh[]>((resolve) => {
    model.createModel((importedModel) => {
      resolve(importedModel);
    });
  });

  /**
   * 2D space GUI Elements Rendering on web
   */
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  // Create robot waving animation
  const robotAnimation = new RobotTaskFactory(advancedTexture);
  const image = robotAnimation.createImage("robotImage", "./Assets/Textures/robot1.png");
  robotAnimation.createAnimation(image);

  //creating rectangle menu
  rectangleMenu.createRectangle();
  rectangleMenu.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT; // Align to the left
  rectangleMenu.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Align to the top
  advancedTexture.addControl(rectangleMenu);
  //creating button
  button.createRectangle();
  button.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  button.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; // Align to the top
  rectangleMenu.addControl(button);
  const positionLabel = new LabelFactory("Position", "0px", "-220px", "#6B1919FF", "#5A1B83FF").createLabel();
  positionLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const frequencyLabel = new LabelFactory("Frequency", "0px", "-130px", "#6B1919FF", "#5A1B83FF").createLabel();
  frequencyLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const amplitudeLabel = new LabelFactory("Amplitude", "0px", "-40px", "#6B1919FF", "#5A1B83FF").createLabel();
  amplitudeLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const relationLabel = new LabelFactory("Relation", "0px", "50px", "#6B1919FF", "#5A1B83FF").createLabel();
  relationLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const statusLabel = new LabelFactory("STATUS", "0px", "200px", "#6B1919FF", "#5A1B83FF").createLabel();

  //Connection label based on the connection status at creation
  rectangleMenu.addControl(positionLabel);
  rectangleMenu.addControl(frequencyLabel);
  rectangleMenu.addControl(amplitudeLabel);
  rectangleMenu.addControl(relationLabel);
  rectangleMenu.addControl(statusLabel);

  //creating sliders and sliders labels
  var slider1Label = new LabelFactory(0, "0px", "-220px", "white", "white").createLabel();
  slider1Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider2Label = new LabelFactory(0, "0px", "-130px", "white", "white").createLabel();
  slider2Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider3Label = new LabelFactory(0, "0px", "-40px", "white", "white").createLabel();
  slider3Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider4Label = new LabelFactory(0, "0px", "50px", "white", "white").createLabel();
  slider4Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  rectangleMenu.addControl(slider1Label);
  rectangleMenu.addControl(slider2Label);
  rectangleMenu.addControl(slider3Label);
  rectangleMenu.addControl(slider4Label);

  //model animation
  let animationFreqPromise = model.setAnimation(modelPromise,scene)
  animationFreqPromise.then((animation) => {
    animation.speedRatio=1;
    animation.pause();
  });
  model.setFreq(1);
  model.setAmp(1);
  const positionSlider = new SliderFactory(-90, 90, 0, "-190px", slider1Label).createSlider();
  positionSlider.setActionSliding3D(animationFreqPromise,scene,modelPromise,"position",model);
  const frequencySlider = new SliderFactory(0, 90, 0, "-100px", slider2Label).createSlider();
  frequencySlider.setActionSliding3D(animationFreqPromise,scene,modelPromise,"frequency",model);
  const amplitudeSlider = new SliderFactory(0, 180, 0, "-10px", slider3Label).createSlider();
  amplitudeSlider.setActionSliding3D(animationFreqPromise,scene,modelPromise,"amplitude",model);
  const relationSlider = new SliderFactory(0, 90, 0, "80px", slider4Label).createSlider();
  relationSlider.setActionSliding();
  rectangleMenu.addControl(positionSlider);
  rectangleMenu.addControl(frequencySlider);
  rectangleMenu.addControl(amplitudeSlider);
  rectangleMenu.addControl(relationSlider);

  //getting sliders in array
  var sliderCollection = [positionSlider,frequencySlider,amplitudeSlider,relationSlider];
  const guiManager= new GUIManager(rectangleMenu,modelPromise,model,sliderCollection,advancedTexture,scene);
  button.setActionButton(guiManager);

  // const guiManager= new GUIManager(rectangleMenu,modelPromise);
  // guiManager.optionGUI2D();

  var connectLabel;
  if (connect) {
    connectLabel = new LabelFactory("CONNECTED", "0px", "230px", "#90EE90", "#90EE90").createLabel();
  } else {
    connectLabel = new LabelFactory("Not connected", "0px", "230px", "#FFA500", "#FFA500").createLabel();
  }
  rectangleMenu.addControl(connectLabel);
  return scene;
};
//CHANGE STATUS OF CONNECTION BEFORE SCENE RENDER
setConnectSuccess();

//Create scene
const scene = await createScene();

engine.runRenderLoop(function () {

  scene.render();
});

window.addEventListener('resize', function () {
  engine.resize();
});
