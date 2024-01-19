//This class handles the switch between the GUI with 3D Model and without a 3D Model

import { ModelFactory3D} from "./ModelFactory3D";
import {animated2DRectangles} from "./animated2DRectangles";
// Importing Babylon.js
import "@babylonjs/loaders";
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import { RectangleFactory } from './RecrangleFactory';
import * as BABYLON from "@babylonjs/core";
import {SliderFactory} from "./SliderFactory";
import {Animatable, Color3} from "@babylonjs/core";

export class GUIManager {
    associatedMenu: RectangleFactory;
    associatedPromise: Promise<BABYLON.AbstractMesh[]>;
    associatedModel: ModelFactory3D;
    associatedSliders: SliderFactory[];
    associatedTexture: GUI.AdvancedDynamicTexture;
    associatedScene: BABYLON.Scene;
    animationPosition: animated2DRectangles;
    animationFrequency: animated2DRectangles;
    animationAmplitude: animated2DRectangles;
    animationRelation: animated2DRectangles;

    constructor( menu: RectangleFactory,promise: Promise<BABYLON.AbstractMesh[]>,model: ModelFactory3D,sliders: SliderFactory[],texture: GUI.AdvancedDynamicTexture,scene: BABYLON.Scene) {
        this.associatedMenu=menu;
        this.associatedPromise=promise;
        this.associatedModel=model;
        this.associatedSliders=sliders;
        this.associatedTexture=texture;
        this.associatedScene=scene;
    }
    switchGUI(checker: boolean){
        if(checker){
            this.optionGUI2D();
        }else{
            this.optionGUI3D();
        }
    }
    animationFreq: Animatable;
    animationAmp: Animatable;
    optionGUI2D() {
        //remove 3D model
        this.remove3DModel(this.associatedPromise);
        //resize the menu to full screen
        this.associatedMenu.setWidth(800);
        //add cute animations
        this.animationPosition = new animated2DRectangles(-170,-175);
        this.animationPosition.create2DAnimaiton(this.associatedTexture);
        this.animationFrequency = new animated2DRectangles(-170,-90);
        this.animationFrequency.create2DAnimaiton(this.associatedTexture);
        this.animationAmplitude = new animated2DRectangles(-170,-5);
        this.animationAmplitude.create2DAnimaiton(this.associatedTexture);
        // this.animationRelation = new animated2DRectangles(-170,80);
        // this.animationRelation.create2DAnimaiton(this.associatedTexture);
        //set animation for rectangles
        this.animationFreq=this.animationFrequency.addAnimation(this.associatedScene);
        this.animationFreq.pause();
        this.animationAmp=this.animationFrequency.addAnimation(this.associatedScene);
        this.animationAmp.pause();
        //change slider logic
        // this.associatedSliders[0].setActionPosition2D(this.animationPosition.rectangleUp);
        this.associatedSliders[0].setActionPosition2D(this.animationPosition.rectangleUp);
        // we need position, freq is static
        this.associatedSliders[1].setActionFrequency2D(this.animationFreq,this.animationFrequency,this.associatedScene,this.associatedSliders[0].value);
        this.associatedSliders[2].setActionAmplitude2D(this.animationAmp,this.animationAmplitude,this.associatedScene);
        this.associatedSliders[3].setActionRelation2D();

        //Set all slides to 0 and EDMO values to 0
        for (let i = 0; i < this.associatedSliders.length; i++) {
            this.associatedSliders[i].value=0;
        }
    }
    optionGUI3D() {
        // resize the menu to old dimensions
        console.log("create 3D Model");
        this.associatedMenu.setWidth(400);
        // bring back 3D model
        const modelPromise = new Promise<BABYLON.AbstractMesh[]>((resolve) => {
            this.associatedModel.createModel((importedModel) => {

                resolve(importedModel);
            });
        });
        this.associatedPromise=modelPromise;
        this.associatedModel.setMeshColor(this.associatedPromise,new Color3(43 / 164.0, 187 / 255.0, 164 / 255.0))
        //change back slide logic
        //model animation
        let animationFreqPromise = this.associatedModel.setAnimation(modelPromise,this.associatedScene)
        animationFreqPromise.then((animation) => {
            animation.speedRatio=1;
            animation.pause();
        });
        this.associatedSliders[0].setActionSliding3D(animationFreqPromise,this.associatedScene,modelPromise,"position",this.associatedModel);
        this.associatedSliders[1].setActionSliding3D(animationFreqPromise,this.associatedScene,modelPromise,"frequency",this.associatedModel);
        this.associatedSliders[2].setActionSliding3D(animationFreqPromise,this.associatedScene,modelPromise,"amplitude",this.associatedModel);
        this.associatedSliders[3].setActionRelation2D();

        //delete cute animations
        this.animationPosition.dispose();
        this.animationFrequency.dispose();
        this.animationAmplitude.dispose();
        //Set all slides to 0 and EDMO values
        for (let i = 0; i < this.associatedSliders.length; i++) {
            this.associatedSliders[i].value=0;
        }
    }
    remove3DModel(promise: Promise<BABYLON.AbstractMesh[]>): void {
        console.log("remove 3D Model");
        promise.then((importedModels) => {
                // importedModels is an array of resolved meshes
            for (let i = 0; i < importedModels.length; i++) {
                importedModels[i].dispose();
            }
                }).catch((error) => {
                // Handle errors if any of the promises fail
                console.error("Error disposing 3D models:", error);
            });
    }
}
