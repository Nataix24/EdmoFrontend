
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {GUIManager} from "./GUIMenager";
import {RectangleFactory} from "./RecrangleFactory";
import * as BABYLON from "@babylonjs/core";
import {Scene, Animation, Vector3, EasingFunction, AnimationGroup, Animatable} from '@babylonjs/core';

export class animated2DRectangles {
    rectangleUp: RectangleFactory;
    rectangleDown: RectangleFactory;
    private amplitude: number;
    private frequency: number;
    private offset: number;

    constructor(x: number,y: number) {
        //define two rectangles that will be used for the animation
        this.rectangleDown= new RectangleFactory(60,"35px",x,y,"#000000");
        this.rectangleUp= new RectangleFactory(60,"35px",x,y-25,"#000000");
    }
    setFreq(freq: number){
        this.frequency=freq;
    }
    getFreq(): number{
        return this.frequency;
    }
    setAmp(amp: number){
        this.amplitude=amp;
    }
    getAmp(): number{
        return this.amplitude;
    }
    setOff(off: number){
        this.offset=off;
    }
    getOff(): number{
        return this.offset;
    }
    /**
     * Method that defines a 2D Rectangle in desired coordinates
     * @returns {Rectangle}
     */
    create2DAnimaiton(associatedTexture: GUI.AdvancedDynamicTexture) {
        this.rectangleUp.createRectangle();
        this.rectangleUp.setBackGroundColor("#9C5586FF");
        this.rectangleUp.setPadding(0);
        this.rectangleDown.createRectangle();
        this.rectangleDown.setBackGroundColor("#9C5586FF");
        this.rectangleDown.setPadding(0);
        associatedTexture.addControl(this.rectangleDown);
        associatedTexture.addControl(this.rectangleUp);
    }
    dispose(){
        this.rectangleDown.dispose();
        this.rectangleUp.dispose();
    }
    animation: Animatable;
    addAnimation(scene: Scene): Animatable {
        // Set the desired frames per second (fps)
        // start of working width animation
        const rotationResolution = 10;

        //Create rotation animation
        var Deg2RadFactor = 3.1415 / 180;
        var value = -90;
        const keysRot = [];
        keysRot.push({
            frame: 0,
            value: Deg2RadFactor*value
        });
        keysRot.push({
            frame: rotationResolution - 1,
            value: Deg2RadFactor*90 // Adjust this value for the desired width change
        });
        // Create width animation
        const rotAnimationForward = new BABYLON.Animation(
            "rotAnimation",
            "rotation",
            this.frequency,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_YOYO,
        );
        rotAnimationForward.setKeys(keysRot);

        console.log("Before animation:", this.rectangleUp.rotation);
        this.animation =scene.beginDirectAnimation(this.rectangleUp, [rotAnimationForward], 0, rotationResolution - 1, true);
        console.log("After animation:", this.rectangleUp.rotation);
        console.log("Before method Freq  even left" + this.animation);
        return this.animation;
    }

}