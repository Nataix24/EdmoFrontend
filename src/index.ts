// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { Task, TaskManager } from './TaskManager.js';
import { EDMOClient } from './EDMOClient';
import { Color3 } from '@babylonjs/core';
//importing GUI customized classes
import { RectangleFactory } from './GUIComponents/RecrangleFactory';
import { LabelFactory } from './GUIComponents/LabelFactory';
import { SliderFactory } from "./GUIComponents/SliderFactory";
import { RobotTaskFactory } from "./GUIComponents/RobotTaskFactory";
// Create an instance of imported gui classes
const rectangleMenu = new RectangleFactory(400, "600px", 0, 0, "#9C5586FF");
// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);
const client = new EDMOClient();
var importedModel: BABYLON.AbstractMesh;
// Connection status
var connect = false;
// Model color
var colorMesh: Color3;
// Set connection status
function setConnectSuccess() {
  connect = true;
}
// Set color of mesh before scene creation
function setColor(color: Color3) {
  colorMesh = color;
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
  // Load the model
  //var importedModel;
  BABYLON.SceneLoader.ImportMesh("", "./Assets/Models/", "untitled.glb", scene, function (newMeshes) {
    //camera.target = newMeshes[0]; // Let the camera target the origin of the entire model
    importedModel = newMeshes[1]; // The part we want to control is the arm, not the whole thing
    importedModel.rotationQuaternion = null; // Babylon will prefer the quartenion if it is present, so we null that out
    const Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
    importedModel.rotation.y = -90 * Deg2RadFactor;
    importedModel.position.z = -63;
    console.log(newMeshes);
    // Iterate through meshes in model
    newMeshes.forEach(function (mesh) {
      // Create a new material
      var material = new BABYLON.StandardMaterial("material", scene);

      // Set color
      material.diffuseColor = colorMesh; // Red color, change as needed

      // Apply the material
      mesh.material = material;
    });
    // Iterate through meshes in model
    newMeshes.forEach(function (mesh) {
      // Create a new material
      var material = new BABYLON.StandardMaterial("material", scene);
      // Set color
      material.diffuseColor = colorMesh; // Red color, change as needed

      // Apply the material
      mesh.material = material;
    });
  }
    , function (event) {
      // Loading progress
      console.log(event.loaded, event.total);
    }
  );
  scene.registerBeforeRender(function () {
    //light.position = camera.position;
    // ^ How did this get written beats me, but it's not needed
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

  const positionSlider = new SliderFactory(-90, 90, 0, "-190px", slider1Label).createSlider();
  positionSlider.onValueChangedObservable.add(function (value) {
    slider1Label.text = value.toFixed(1);
    if (importedModel) {
      if (client.ID >= 0)
        client.sendMessage(`off ${value.toFixed(1)}`);
      var Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
      importedModel.rotation.x = value * Deg2RadFactor;
      console.log("New Rotation Y:", importedModel.rotation.x);
    }
  });
  const frequencySlider = new SliderFactory(0, 90, 0, "-100px", slider2Label).createSlider();
  frequencySlider.setActionSliding();
  const amplitudeSlider = new SliderFactory(0, 90, 0, "-10px", slider3Label).createSlider();
  amplitudeSlider.setActionSliding();
  const relationSlider = new SliderFactory(0, 90, 0, "80px", slider4Label).createSlider();
  relationSlider.setActionSliding();
  rectangleMenu.addControl(positionSlider);
  rectangleMenu.addControl(frequencySlider);
  rectangleMenu.addControl(amplitudeSlider);
  rectangleMenu.addControl(relationSlider);

  var connectLabel;
  if (connect) {
    connectLabel = new LabelFactory("CONNECTED", "0px", "230px", "#90EE90", "#90EE90").createLabel();
  } else {
    connectLabel = new LabelFactory("Not connected", "0px", "230px", "#FFA500", "#FFA500").createLabel();
  }
  rectangleMenu.addControl(connectLabel);
  return scene;
};

//SET COLOR OF MODEL BEFORE SCENE CREATION
setColor(new BABYLON.Color3(242 / 255.0, 187 / 255.0, 233 / 255.0));
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
