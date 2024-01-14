import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import * as BABYLON from "@babylonjs/core";
import {Color3, Nullable, Scene} from "@babylonjs/core";

export class ModelFactory3D {
    meshForRotation: BABYLON.AbstractMesh[];
    setMesh(mesh: BABYLON.AbstractMesh[]){
        this.meshForRotation=mesh;
        console.log(this.meshForRotation);
    }
    getMesh(){
        console.log("giving back mesh");
        return this.meshForRotation;
    }
    constructor(scene: BABYLON.Scene) {
        //SET COLOR OF MODEL BEFORE SCENE CREATION
        this.colorMesh= new BABYLON.Color3(242 / 255.0, 187 / 255.0, 233 / 255.0);
        this.associatedScene=scene;
    }
    colorMesh: Color3;
    associatedScene: BABYLON.Scene;
    // Set color of mesh before scene creation
    setColor(color: Color3) {
        this.colorMesh = color;
    }
    //This method changes the color of the 3D Hand
    setMeshColor(promise: Promise<BABYLON.AbstractMesh[]>,color: Color3){
        promise.then((importedModel) => {
            var material = new BABYLON.StandardMaterial("material", this.associatedScene);
            this.setColor(color);
            material.diffuseColor = this.colorMesh;
            for (let i = 0; i < importedModel.length; i++) {
                importedModel[i].material = material;
            }
        });
    }

    // Returns the Mesh of the model we are rotating
    createModel(callback: (mesh: BABYLON.AbstractMesh[]) => void) {
        var importedModel: BABYLON.AbstractMesh;
        BABYLON.SceneLoader.ImportMesh("", "./Assets/Models/", "untitled.glb", this.associatedScene, (newMeshes) => {
            importedModel = newMeshes[1];
            importedModel.rotationQuaternion = null;
            const Deg2RadFactor = 3.1415 / 180;
            importedModel.rotation.y = -90 * Deg2RadFactor;
            importedModel.position.z = -63;
            console.log(newMeshes);
            newMeshes.forEach((mesh) => {
                var material = new BABYLON.StandardMaterial("material", this.associatedScene);
                material.diffuseColor = this.colorMesh;
                mesh.material = material;
            });
            this.setMesh(newMeshes);
            callback(newMeshes); // Call the callback after the mesh is loaded
        }, (event) => {
            console.log(event.loaded, event.total);
        });

    }
}