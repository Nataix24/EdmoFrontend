// Importing Babylon.js
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D'
// Assign canvas to a variable 
const canvas = document.getElementById('renderCanvas');
// Create instance of babylonjs class and pass the canvas to constructor
// In this way we are telling the scene to render this canvas element
const engine = new BABYLON.Engine(canvas);




const createScene = async function() {
  const scene = new BABYLON.Scene(engine);
  //Adding a light
  var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  //Adding an Arc Rotate Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", 0.4, 0.9, 160, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, false);

  // Load the model
  var importedModel;
  BABYLON.SceneLoader.ImportMesh("", "/Models/", "untitled.glb", scene, function (newMeshes) {
    console.log("Model loading complete");
    // importedModel.position.x += 40; // Adjust the value as needed
    // Set the target of the camera to the first imported mesh
    camera.target = newMeshes[0];
    importedModel = newMeshes[0];

    console.log(newMeshes);
     // Now that the model is loaded, you can manipulate its properties
}, function (event) {
  // Loading progress
  console.log(event.loaded, event.total);
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
   scene.registerBeforeRender(function () {
    light.position = camera.position;
});
  //GUI 
  const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');
  //const loadGUI = await advancedTexture.parseFromSnippetAsync('YIUH5G#1');

  // Create a rectangle
  function createRectangle(width,height) {
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
  function createSlider(minimum, maximum, initialValue, topOffset, leftText, topText) {
    const slider = new GUI.Slider();
    slider.minimum = minimum; // Set the minimum value
    slider.maximum = maximum; // Set the maximum value
    slider.value = initialValue; // Set the initial value
    slider.width = 0.17;
    slider.height = "27px";
    slider.top = topOffset; // Set the position below the rectangle
    slider.left = "1480px"
    slider.background="#4E3650FF";
    slider.color = "#512858FF";
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left

    var header = new GUI.TextBlock();
    header.text = slider.value;
    header.height = "30px";
    header.left=leftText;
    header.top=topText;
    header.color = "white";
    advancedTexture.addControl(header); 
  
    slider.onValueChangedObservable.add(function(value) {
      header.text = value.toFixed(1);
      if (importedModel) {
         importedModel.rotation.y = value;
         console.log("New Rotation Y:", importedModel.rotation.y);
      }
   });
    // Add the slider to the advanced dynamic texture
    advancedTexture.addControl(slider);
  }
    // Create a label
    function createLabel(text,left,top) {
      var header = new GUI.TextBlock();
      header.text = text;
      header.height = "30px";
      header.left=left;
      header.top=top;
      header.color = "#5A1B83FF";
      header.fontFamily = "Courier New"; // Set the font style
      header.fontSize=24
      header.outlineWidth = 1; // Set the outline width
      header.outlineColor = "#6B1919FF"; // Set the outline color
      advancedTexture.addControl(header); 
    }


  createRectangle(0.2,"600px");
  createSlider(-90,90,0,"-190px","830px","-220px");
  createSlider(0,90,0,"-100px","830px","-130px");
  createSlider(0,90,0,"-10px","830px","-40px");
  createLabel("Position","683px","-220px");
  createLabel("Frequency","683px","-130px");
  createLabel("Amplitude","683px","-40px");


  return scene;
}

//Assigning it to a variable to use later on in the render loop
const scene= await createScene();

engine.runRenderLoop(function(){
  scene.render();
});

//This resize function sccures that with resizing the window the objects wont change their shapes
window.addEventListener('resize',function(){
  engine.resize();
});