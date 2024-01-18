// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { EDMOClient } from './EDMOClient';
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
const client = new EDMOClient();
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
  });
  const positionSlider = new SliderFactory(-90, 90, 0, "-190px", slider1Label).createSlider();
  positionSlider.setActionSlidingPosition(modelPromise);
  const frequencySlider = new SliderFactory(0, 90, 0, "-100px", slider2Label).createSlider();
  frequencySlider.setActionSliding3D(animationFreqPromise);
  const amplitudeSlider = new SliderFactory(0, 90, 0, "-10px", slider3Label).createSlider();
  amplitudeSlider.setActionSliding();
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

// Method to create setup screen
const createSetup = async function () {
  var scene = new BABYLON.Scene(engine);

  //Defining a light and camera for the 3D scene
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  var camera = new BABYLON.ArcRotateCamera("Camera", 0.4, 0.9, 260, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, false);

  // Create GUI
  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  
  // Create settings icon
  var image = new GUI.Image("settings", "./Assets/Textures/settings.png");
  image.top = "-150px";
  image.width = "80px";
  image.height = "80px";

  advancedTexture.addControl(image);

  //https://www.babylonjs-playground.com/#U9AC0N#13

  // Rectangle background
  const rectangle = new RectangleFactory(600, "250px", 0, 0, "#9C5586FF");
  rectangle.left = "20px";
  rectangle.top  = "40px";
  rectangle.createRectangle();

  advancedTexture.addControl(rectangle);

  // Stack panel setup to hold radiobuttons
  var panel = new GUI.StackPanel();
  panel.width = "150px";  // Set the width of the StackPanel
  panel.top = "0px"; // Set the top position in pixels
  panel.left = "150px"; // Set the left position in pixels
  panel.fontFamily = "Courier New";
  advancedTexture.addControl(panel);

  var panel2 = new GUI.StackPanel();
  panel2.width = "150px";  // Set the width of the StackPanel
  panel2.top = "0px"; // Set the top position in pixels
  panel2.left = "-150px"; // Set the left position in pixels
  panel2.fontFamily = "Courier New";
  advancedTexture.addControl(panel2);

  // Radiobutton groups, do not delete
  var group = new GUI.RadioGroup("G1");
  var group2 = new GUI.RadioGroup("G2");

  // Fucntion to add a radio button to a stack panel and a given radio group
  var addRadio = function(text: string, parent: GUI.StackPanel, groupval: BABYLON.int, selected: boolean) {
    var button = new GUI.RadioButton();
    button.width = "20px";
    button.height = "20px";
    button.color = "white";
    button.background = "#5A1B83FF";     
    
    if (groupval ==1) {
      button.group = "G1";
      //console.log(button.group);
      
    }else{button.group = "G2";
    //console.log(button.group);
    }

    if (selected) {
      button.isChecked =true;
    }

    //#6B1919FF red
    //#5A1B83FF purple

    // Update global variables based on selection
    button.onIsCheckedChangedObservable.add(function(state) {
        if (button.group =="G1") {
            language = text;
        }else{
          display = text;
        }
    }); 

    var header = GUI.Control.AddHeader(button, text, "100px", { isHorizontal: true, controlFirst: true});
    header.height = "30px";

    parent.addControl(header);    
  }

  // Add radio buttons to respective panels and groups
  addRadio("EN", panel, 1, true);
  addRadio("NL", panel, 1, false);

  addRadio("2D", panel2, 2, true);
  addRadio("3D", panel2, 2, false);
  addRadio("Model", panel2, 2, false);
  
  // Text box setup
  var inputText = new GUI.InputText();
  inputText.text = "";
  inputText.width = "500px";
  inputText.height = "40px";
  inputText.color = "white"; ////pink
  inputText.background = "#6673fa";
  inputText.top = "130px";
  inputText.fontFamily = "Courier New";
  inputText.onTextChangedObservable.add(function (newText) {
      url =inputText.text;
  });

  // URL label
  var urlLabel = new LabelFactory("URL", "0px", "85px", "black", "black").createLabel();
 
  advancedTexture.addControl(urlLabel);
  advancedTexture.addControl(inputText);
  
  // Create start button
  var button = GUI.Button.CreateSimpleButton("button", "✓");
  button.background = "#a832a8";
  button.width = "200px";
  button.height = "40px";
  button.top = "200px";
  
  // When start button is pressed
  button.onPointerUpObservable.add(function () {
    // Basic check for empty textbox
    if (url == "") {
      alert("URL REQUIRED");
      // Open main scene
    }else{openScene();}
  });
  
  advancedTexture.addControl(button);

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
