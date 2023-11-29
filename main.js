// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D'
import { Task, TaskManager } from '/taskMenager.js';
// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas');
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);
const taskManager = new TaskManager();
var importedModel = null;

/**
 * Method that defines all the tasks
 */
function defineTasks() {
// Create instances of Task
  const task1 = new Task('Complete assignment');
  const task2 = new Task('Go for a run');
  const task3 = new Task('Read a book');
// Add tasks to the TaskManager
  taskManager.addTask(task1);
  taskManager.addTask(task2);
  taskManager.addTask(task3);
}

/**
 * Method that defines a 2D Rectangle in desired coordinates
 * @param width - width of the rectangle
 * @param height - height of the rectangle
 * @returns {Rectangle}
 */
function createRectangle(width, height) {
  // Create a rectangle
  const rect = new GUI.Rectangle();
  rect.width = width; // Set the width of the rectangle
  rect.height = height; // Set the height of the rectangle
  rect.background = "#9C5586FF"; // Set the desired background color
  rect.cornerRadius = 20; // Set the corner radius
  rect.color = "#9C5586FF"; // Set the color of the rectangle
  rect.left = "680px"; // Set the left position
  rect.alpha = 0.74;
  rect.top = "10px"; // Set the top position
  return rect;
}

/**
 * This function defines a label in a 2D space
 * @param text
 * @param left - x coordinate
 * @param top - y coordinate
 * @param outlineColor
 * @param color
 * @returns {TextBlock}
 */
function createLabel(text, left, top,outlineColor,color) {
  var header = new GUI.TextBlock();
  header.text = text;
  header.height = "30px";
  header.left = left;
  header.top = top;
  header.color = color;
  header.fontFamily = "Courier New"; // Set the font style
  header.fontSize = 24
  header.outlineWidth = 1; // Set the outline width
  header.outlineColor = outlineColor; // Set the outline color
  return header;
}

/**
 * Function that defines a slider in a 2D space used to control the EDMO arm
 * @param minimum - minimum value a slider can have
 * @param maximum - maximum value a slider can have
 * @param initialValue - initial value of a slider
 * @param topOffset - x coordinate
 * @param stringFunctionDecider - String representing what the slider control (example: Position)
 * @param header - the label that showcase the value of the slider
 * @returns {Slider}
 */
function createSlider(minimum, maximum, initialValue, topOffset,stringFunctionDecider,header) {
  const slider = new GUI.Slider();
  slider.minimum = minimum; // Set the minimum value
  slider.maximum = maximum; // Set the maximum value
  slider.value = initialValue; // Set the initial value
  slider.width = 0.17;
  slider.height = "27px";
  slider.top = topOffset; // Set the position below the rectangle
  slider.left = "1480px"
  slider.background = "#4E3650FF";
  slider.color = "#512858FF";
  slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left

  header.text=slider.value;
  if(stringFunctionDecider=="Position") {
    slider.onValueChangedObservable.add(function (value) {
      header.text = value.toFixed(1);
      if (importedModel) {
        var Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
        importedModel.rotation.x = value * Deg2RadFactor;
        console.log("New Rotation Y:", importedModel.rotation.x);
      }
    });
  }
  else if(stringFunctionDecider=="Frequency") {
    slider.onValueChangedObservable.add(function (value) {
      header.text = value.toFixed(1);
      if (importedModel) {
        console.log("Frequency value: ", value);
      }
    });
  }
  else if(stringFunctionDecider=="Amplitude") {
    slider.onValueChangedObservable.add(function (value) {
      header.text = value.toFixed(1);
      if (importedModel) {
        console.log("Frequency value: ", value);
      }
    });
  }
  else if(stringFunctionDecider=="Relation") {
    slider.onValueChangedObservable.add(function (value) {
      header.text = value.toFixed(1);
      if (importedModel) {
        console.log("Frequency value: ", value);
      }
    });
  }
  return slider;
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
  var importedModel;
  BABYLON.SceneLoader.ImportMesh("", "/Models/", "untitled.glb", scene, function (newMeshes) {
    camera.target = newMeshes[0]; // Let the camera target the origin of the entire model
    importedModel = newMeshes[1]; // The part we want to control is the arm, not the whole thing
    importedModel.rotationQuaternion = null; // Babylon will prefer the quartenion if it is present, so we null that out
    const Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
    importedModel.rotation.y =-90* Deg2RadFactor;
    importedModel.position.z = -63;
    console.log(newMeshes);
  }
    , function (event) {
      // Loading progress
      console.log(event.loaded, event.total);
    }
  );
  scene.registerBeforeRender(function () {
    light.position = camera.position;
  });

  /**
   * 2D space GUI Elements Rendering on web
   */
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  // Create an image on the overlay
  const image = new GUI.Image("robotImage", "/Models/robot1.png");
  image.width = 0.2; // Set the width of the image
  image.height = 0.4; // Set the height of the image
  image.top=280;
  image.left=-750;
  advancedTexture.addControl(image);

// Array to store paths of individual robot images
  const robotImages = [
    "/Models/robot1.png",
    "/Models/robot2.png",
    "/Models/robot3.png",
    "/Models/robot4.png"
  ];

  // Animation logic
    let currentRobotIndex = 0;
    let timeElapsed = 0; // Variable to track time

    scene.onBeforeRenderObservable.add(() => {
      // Update the image every 500 milliseconds (adjust as needed)
      timeElapsed += scene.getEngine().getDeltaTime();
      if (timeElapsed > 500) {
        // Change the image to the next robot in the array
        image.source = robotImages[currentRobotIndex];

        // Increment the robot index for the next iteration
        currentRobotIndex = (currentRobotIndex + 1) % robotImages.length;

        // Reset the time elapsed
        timeElapsed = 0;
      }
    });
  // creating rectangle menu
  const rect = createRectangle(0.2,"600px");
  advancedTexture.addControl(rect);

  // creating labels
  const positionLabel = createLabel("Position", "683px", "-220px","#6B1919FF","#5A1B83FF");
  const frequencyLabel = createLabel("Frequency", "683px", "-130px","#6B1919FF","#5A1B83FF");
  const amplitudeLabel = createLabel("Amplitude", "683px", "-40px","#6B1919FF","#5A1B83FF")
  const relationLabel =  createLabel("Relation", "683px", "50px","#6B1919FF","#5A1B83FF");
  advancedTexture.addControl(positionLabel);
  advancedTexture.addControl(frequencyLabel);
  advancedTexture.addControl(amplitudeLabel);
  advancedTexture.addControl(relationLabel);

  //creating sliders and sliders labels
  var slider1Label = createLabel(0,"830px","-220px","white","white");
  var slider2Label = createLabel(0,"830px","-130px","white","white");
  var slider3Label = createLabel(0,"830px","-40px","white","white");
  var slider4Label = createLabel(0,"830px","50px","white","white");
  advancedTexture.addControl(slider1Label);
  advancedTexture.addControl(slider2Label);
  advancedTexture.addControl(slider3Label);
  advancedTexture.addControl(slider4Label);
  const positionSlider =createSlider(-90, 90, 0, "-190px",  "Position",slider1Label);
  const frequancySlider =createSlider(0, 90, 0, "-100px",  "Frequency",slider2Label);
  const amplitudeSlider =createSlider(0, 90, 0, "-10px",  "Amplitude",slider3Label);
  const relationSlider =createSlider(0, 90, 0, "80px", "Relation",slider4Label);
  advancedTexture.addControl(positionSlider);
  advancedTexture.addControl(frequancySlider);
  advancedTexture.addControl(amplitudeSlider);
  advancedTexture.addControl(relationSlider);

  //creating tasks
  defineTasks();
  taskManager.listTasks();
  return scene;
}

// Function to handle window resize


//Assigning it to a variable to use later on in the render loop
const scene = await createScene();

engine.runRenderLoop(function () {
  scene.render();
});

//This resize function sccures that with resizing the window the objects wont change their shapes
window.addEventListener('resize', function () {
  engine.resize();
});

