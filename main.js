// Importing Babylon.js
//new
//new
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { Task, TaskManager } from '/taskMenager.js';
// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas');
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);

const taskManager = new TaskManager();
var importedModel = null;

// Connection status
var connect =false;

// Model color
var colorMesh;

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

// Set connection status
function setConnectSuccess() {
  connect = true;
}

// Set color of mesh before scene creation
function setColor(color) {
  colorMesh = color;
}

// Function to refresh the webpage
function refreshPage() {
  location.reload(true); // Pass true to force a reload from the server, ignoring the cache
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
  rect.widthInPixels = 400; // Set the width of the rectangle
  rect.height = height; // Set the height of the rectangle
  rect.background = "#9C5586FF"; // Set the desired background color
  rect.cornerRadius = 20; // Set the corner radius
  rect.color = "#9C5586FF"; // Set the color of the rectangle
  rect.alpha = 0.74;
  rect.autoScale = true; // Automatically fit children
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
function createLabel(text, left, top, outlineColor, color) {
  var header = new GUI.TextBlock();
  header.text = text;
  header.height = "30px";
  header.top = top;
  header.color = color;
  header.fontFamily = "Courier New"; // Set the font style
  header.fontSize = 24;
  header.outlineWidth = 1; // Set the outline width
  header.outlineColor = outlineColor; // Set the outline color
  header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Align to the left
  header.paddingLeft = 40;
  header.paddingRight = 40;
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
  BABYLON.SceneLoader.ImportMesh("", "/Models/", "untitled.glb", scene, function (newMeshes) {
    camera.target = newMeshes[0]; // Let the camera target the origin of the entire model
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
    light.position = camera.position;
  });

  /**
   * 2D space GUI Elements Rendering on web
   */
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

  // Create an image on the overlay
  const image = new GUI.Image("robotImage", "/Models/robot1.png");
  image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; // Align to the top
  image.widthInPixels = 300;
  image.heightInPixels = 300;
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
  const rect = createRectangle(0.2, "600px");
  rect.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT; // Align to the left
  rect.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Align to the top
  rect.paddingRight = 40;
  advancedTexture.addControl(rect);

  ///////////////////
  function createSlider(minimum, maximum, initialValue, topOffset, stringFunctionDecider, header) {
    const slider = new GUI.Slider();
    slider.minimum = minimum; // Set the minimum value
    slider.maximum = maximum; // Set the maximum value
    slider.value = initialValue; // Set the initial value
    slider.width = 1;
    slider.height = "27px";
    slider.top = topOffset; // Set the position below the rectangle
    slider.background = "#4E3650FF";
    slider.color = "#512858FF";
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Align to the left
    slider.paddingLeft = 20;
    slider.paddingRight = 20;

    header.text = slider.value;
    if (stringFunctionDecider == "Position") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          var Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
          importedModel.rotation.x = value * Deg2RadFactor;
          console.log("New Rotation Y:", importedModel.rotation.x);
        }
      });
    }
    else if (stringFunctionDecider == "Frequency") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          console.log("Frequency value: ", value);
        }
      });
    }
    else if (stringFunctionDecider == "Amplitude") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          console.log("Frequency value: ", value);
        }
      });
    }
    else if (stringFunctionDecider == "Relation") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          console.log("Frequency value: ", value);
        }
      });
    }
    return slider;
  }


  const positionLabel = createLabel("Position", "683px", "-220px", "#6B1919FF", "#5A1B83FF");
  positionLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const frequencyLabel = createLabel("Frequency", "683px", "-130px", "#6B1919FF", "#5A1B83FF");
  frequencyLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const amplitudeLabel = createLabel("Amplitude", "683px", "-40px", "#6B1919FF", "#5A1B83FF");
  amplitudeLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const relationLabel = createLabel("Relation", "683px", "50px", "#6B1919FF", "#5A1B83FF");
  relationLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  const statusLabel = createLabel("STATUS", "683px", "200px", "#6B1919FF", "#5A1B83FF");
  statusLabel.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left

  //Connection label based on the connection status at creation
  var connectLabel;

  if (connect) {
    connectLabel = createLabel("CONNECTED", "683px", "230px", "#90EE90", "#90EE90");
  } else {
    connectLabel = createLabel("Not connected", "683px", "230px", "#FFA500", "#FFA500");
  }

  rect.addControl(positionLabel);
  rect.addControl(frequencyLabel);
  rect.addControl(amplitudeLabel);
  rect.addControl(relationLabel);
  rect.addControl(statusLabel);
  rect.addControl(connectLabel);

  //creating sliders and sliders labels
  var slider1Label = createLabel(0, "830px", "-220px", "white", "white");
  slider1Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider2Label = createLabel(0, "830px", "-130px", "white", "white");
  slider2Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider3Label = createLabel(0, "830px", "-40px", "white", "white");
  slider3Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  var slider4Label = createLabel(0, "830px", "50px", "white", "white");
  slider4Label.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  rect.addControl(slider1Label);
  rect.addControl(slider2Label);
  rect.addControl(slider3Label);
  rect.addControl(slider4Label);

  const positionSlider = createSlider(-90, 90, 0, "-190px", "Position", slider1Label);
  const frequancySlider = createSlider(0, 90, 0, "-100px", "Frequency", slider2Label);
  const amplitudeSlider = createSlider(0, 90, 0, "-10px", "Amplitude", slider3Label);
  const relationSlider = createSlider(0, 90, 0, "80px", "Relation", slider4Label);
  rect.addControl(positionSlider);
  rect.addControl(frequancySlider);
  rect.addControl(amplitudeSlider);
  rect.addControl(relationSlider);

  //creating tasks
  defineTasks();
  taskManager.listTasks();
  return scene;
};

//SET COLOR OF MODEL BEFORE SCENE CREATION
setColor(new BABYLON.Color3(1, 0, 0));
//new BABYLON.Color3(0, 1, 0);
//new BABYLON.Color3(1, 0, 0);
//new BABYLON.Color3(0, 0, 1);

//CHANGE STATUS OF CONNECTION BEFORE SCENE RENDER
setConnectSuccess();

//Create scene
const scene = await createScene();

//This resize function sccures that with resizing the window the objects wont change their shapes
// ----- To mess with this, in style.css change width and height to percentage

// window.addEventListener('resize', function () {
//   engine.resize();
// });

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener('resize', function () {
  engine.resize();
});



// Messing around with resizing

// window.addEventListener("resize", function () {
//   //advancedTexture.scaleTo(engine.getRenderWidth(), engine.getRenderHeight());
//   //advancedTexture.scaleTo(advancedTexture.getScene()!.getEngine().getRenderWidth(), advancedTexture.getScene()!.getEngine().getRenderHeight());
//   engine.setSize(window.innerWidth, window.innerHeight);
//   // engine.resize();
//   this.forceUpdate();
//   //advancedTexture.markAsDirty(); // Mark GUI as dirty to trigger update
// });


//cd C:\Users\schre\OneDrive\Desktop\EdmoFrontend-main
