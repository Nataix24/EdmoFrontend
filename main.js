// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D'
// Assign canvas to a variable
const canvas = document.getElementById('renderCanvas');
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);

var importedModel = null;


const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  //Adding a light
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  //Adding an Arc Rotate Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0.4, 0.9, 260, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, false);

  // Load the model
  var importedModel;
  BABYLON.SceneLoader.ImportMesh("", "/Models/", "untitled.glb", scene, function (newMeshes) {
    console.log("Model loading complete");
    // importedModel.position.x += 40; // Adjust the value as needed
    // Set the target of the camera to the first imported mesh

    camera.target = newMeshes[0]; // Let the camera target the origin of the entire model
    importedModel = newMeshes[1]; // The part we want to control is the arm, not the whole thing
    importedModel.rotationQuaternion = null; // Babylon will prefer the quartenion if it is present, so we null that out
    const Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
    // importedModel.rotation.z =0* Deg2RadFactor;
    importedModel.rotation.y =-90* Deg2RadFactor;
    importedModel.position.z = -63; // Adjust the value as needed
    console.log(newMeshes);
    // Now that the model is loaded, you can manipulate its properties
  }
    , function (event) {
      // Loading progress
      console.log(event.loaded, event.total);
    }
  );

  scene.registerBeforeRender(function () {
    light.position = camera.position;
  });

  // // Load the glb model
  //  const importedModel = BABYLON.SceneLoader.ImportMeshAsync('', '/Models/', 'untitled.glb', scene);
  //  //console.log('Model Loaded:', importedModel);
  //   // Access the root mesh of the imported model
  // importedModel.then((result) => {
  //   const modelRoot = result.meshes[0];
  //   camera.target = modelRoot;
  //   // Scale down the model by setting the scaling property
  //   modelRoot.scaling = new BABYLON.Vector3(0.03, 0.03, 0.03); // Adjust the scaling factors as needed
  // });
  // Move the light with the camera

  //GUI
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  //const loadGUI = await advancedTexture.parseFromSnippetAsync('YIUH5G#1');

  // Create a rectangle
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
    advancedTexture.addControl(rect);
  }

  //Create a Slider
  function createSlider(minimum, maximum, initialValue, topOffset, leftText, topText,stringFunctionDecider) {
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

    var header = new GUI.TextBlock();
    header.text = slider.value;
    header.height = "30px";
    header.left = leftText;
    header.top = topText;
    header.color = "white";
    advancedTexture.addControl(header);

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
    // Add the slider to the advanced dynamic texture
    advancedTexture.addControl(slider);
  }
  // Create a label
  function createLabel(text, left, top) {
    var header = new GUI.TextBlock();
    header.text = text;
    header.height = "30px";
    header.left = left;
    header.top = top;
    header.color = "#5A1B83FF";
    header.fontFamily = "Courier New"; // Set the font style
    header.fontSize = 24
    header.outlineWidth = 1; // Set the outline width
    header.outlineColor = "#6B1919FF"; // Set the outline color
    advancedTexture.addControl(header);
  }
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

  createRectangle(0.2, "600px");
  createSlider(-90, 90, 0, "-190px", "830px", "-220px","Position");
  createSlider(0, 90, 0, "-100px", "830px", "-130px","Frequency");
  createSlider(0, 90, 0, "-10px", "830px", "-40px","Amplitude");
  createSlider(0, 90, 0, "80px", "830px", "50px","Relation");
  createLabel("Position", "683px", "-220px");
  createLabel("Frequency", "683px", "-130px");
  createLabel("Amplitude", "683px", "-40px")
  createLabel("Relation", "683px", "50px");



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

