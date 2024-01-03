// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { Task, TaskManager } from './taskMenager.js';
import { EDMOClient } from './EDMOClient';
import { Color3 } from '@babylonjs/core';

//importing GUI customized classes
import { RecrangleFactory } from './GUIComponents/RecrangleFactory';
import { LabelFactory } from './GUIComponents/LabelFactory';
// Create an instance of imported gui classes
const rectangleMenu = new RecrangleFactory(400, "600px", 0, 0, "#9C5586FF");


// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);
const client = new EDMOClient();

const taskManager = new TaskManager();
var importedModel: BABYLON.AbstractMesh;

// Connection status
var connect = false;

// Model color
var colorMesh: Color3;

/**
 * Method that defines all the tasks
 */
function defineTasks() {
  // Create instances of Task
  const task1 = new Task('Find the parameters that will make the robot walk');
  const task2 = new Task('Walk the robot to the mountain');
  const task3 = new Task('make the robot run as fast as possible');
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

  // Create an image on the overlay
  const image = new GUI.Image("robotImage", "./Assets/Textures/robot1.png");
  image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
  image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; // Align to the top
  image.widthInPixels = 300;
  image.heightInPixels = 300;
  advancedTexture.addControl(image);

  // Array to store paths of individual robot images
  const robotImages = [
    "./Assets/Textures/robot1.png",
    "./Assets/Textures/robot2.png",
    "./Assets/Textures/robot3.png",
    "./Assets/Textures/robot4.png"
  ];

  //  Task logic
  let isTaskPressed = false; //Defining a flag booblean for task toggling
  let taskText;
  let cloud = new RecrangleFactory(600, "300px", 0, 0, "white");
  //  for robot image clicking
  image.onPointerClickObservable.add(() => {
    // If the task is not displayed then create the task
    if (!isTaskPressed) {
      console.log("in create loop");
      // Robot animation waving hand up
      const changeImagesWithDelay = async () => {
        for (let i = 0; i < robotImages.length; i++) {
          image.source = robotImages[i];

          // Introduce a delay of 1000 milliseconds (1 second) before the next iteration
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      };

      changeImagesWithDelay();
      //Create task frame
      cloud.createRectangle();
      cloud.background = "white";
      advancedTexture.addControl(cloud);

      //Adding text to the cloud
      taskText = new LabelFactory(taskManager.getTask(1), 0, 0, "black", "black").createLabel();
      cloud.addControl(taskText);

      isTaskPressed = true;
    }
    else if (isTaskPressed) {
      console.log("in dispose loop");
      cloud.dispose();

      isTaskPressed = false;
      const changeImagesWithDelay = async () => {
        for (let i = robotImages.length; i >= 0; i--) {
          image.source = robotImages[i];

          // Introduce a delay of 1000 milliseconds (1 second) before the next iteration
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      };
      changeImagesWithDelay();
    }
  });

  //creating rectangle menu
  rectangleMenu.createRectangle();
  advancedTexture.addControl(rectangleMenu);

  ///////////////////
  function createSlider(minimum: number, maximum: number, initialValue: number, topOffset: string | number, stringFunctionDecider: string, header: GUI.TextBlock) {
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

    header.text = slider.value.toString();
    if (stringFunctionDecider == "Position") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          if (client.ID >= 0)
            client.sendMessage(`off ${value.toFixed(1)}`);

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
          if (client.ID >= 0)
            client.sendMessage(`amp ${value.toFixed(1)}`);
          console.log("Amplitude value: ", value);
        }
      });
    }
    else if (stringFunctionDecider == "Relation") {
      slider.onValueChangedObservable.add(function (value) {
        header.text = value.toFixed(1);
        if (importedModel) {
          console.log("RElation value: ", value);
        }
      });
    }
    return slider;
  }

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
  var connectLabel;

  if (connect) {
    connectLabel = new LabelFactory("CONNECTED", "0px", "230px", "#90EE90", "#90EE90").createLabel();
  } else {
    connectLabel = new LabelFactory("Not connected", "0px", "230px", "#FFA500", "#FFA500").createLabel();
  }

  rectangleMenu.addControl(positionLabel);
  rectangleMenu.addControl(frequencyLabel);
  rectangleMenu.addControl(amplitudeLabel);
  rectangleMenu.addControl(relationLabel);
  rectangleMenu.addControl(statusLabel);
  rectangleMenu.addControl(connectLabel);

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

  const positionSlider = createSlider(-90, 90, 0, "-190px", "Position", slider1Label);
  const frequancySlider = createSlider(0, 90, 0, "-100px", "Frequency", slider2Label);
  const amplitudeSlider = createSlider(0, 90, 0, "-10px", "Amplitude", slider3Label);
  const relationSlider = createSlider(0, 90, 0, "80px", "Relation", slider4Label);
  rectangleMenu.addControl(positionSlider);
  rectangleMenu.addControl(frequancySlider);
  rectangleMenu.addControl(amplitudeSlider);
  rectangleMenu.addControl(relationSlider);

  //creating tasks
  defineTasks();
  taskManager.listTasks();
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