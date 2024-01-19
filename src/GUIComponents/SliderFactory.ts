import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import * as BABYLON from "@babylonjs/core";
import {GUIManager} from "./GUIMenager";
import {RectangleFactory} from "./RecrangleFactory";
import {animated2DRectangles} from "./animated2DRectangles";
import {Animatable, Scene} from "@babylonjs/core";
import {ModelFactory3D} from "./ModelFactory3D";
import {Animaitons} from "./Animaitons";

export class SliderFactory extends GUI.Slider {
    associatedTextBlock: GUI.TextBlock;

    constructor(minimum: number, maximum: number, initialValue: number, topOffset: string | number, textBlock: GUI.TextBlock) {
        super();
        this.minimum = minimum; // Set the minimum value
        this.maximum = maximum; // Set the maximum value
        this.value = initialValue; // Set the initial value
        this.top = topOffset; // Set the position below the rectangle
        this.associatedTextBlock = textBlock;
    }

    /**
     * This function defines a slider in a 2D space
     * @returns {TextBlock}
     */
    createSlider() {

        this.width = 1;
        this.height = "27px";
        this.background = "#4E3650FF";
        this.color = "#512858FF";
        this.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Align to the left
        this.paddingLeft = 20;
        this.paddingRight = 20;
        return this;
    }
    setActionSliding(animation: Animatable,rectangle: animated2DRectangles) {
        //Action on slider moved
        console.log("In slider check" + animation);
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
        // Action when slider thumb is released
        this.onPointerUpObservable.add(() => {
            // This code will be executed when the slider thumb is released
            console.log("Slider thumb released. Final value: " + this.value.toFixed(1));

            // Check if animation is defined before using it
            if (animation) {

                animation.speedRatio = this.value/40;
                console.log("After Slider Freq " + animation);
                // Do any other processing or actions you need
            } else {
                console.error("Animation is undefined inside onPointerUpObservable");
            }
        });
    }

    setActionSlidingPosition(animation: Animatable,rectangle: animated2DRectangles,scene: Scene, purpose: string): void {
        //Action on slider moved
        console.log("In slider check" + animation);
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
        // Action when slider thumb is released
        this.onPointerUpObservable.add(() => {
            // This code will be executed when the slider thumb is released
            console.log("Slider thumb released. Final value: " + this.value.toFixed(1));
            // Check if animation is defined before using it
            if (animation) {
                if(purpose==="frequency"){
                    console.log("frequency arrrr:" +rectangle.getFreq());
                    rectangle.setFreq(this.value);
                    let newAnim = new Animaitons(rectangle.getAmp(), rectangle.getFreq(), rectangle.getOff());
                    newAnim.modifyAnimation2D(rectangle.rectangleUp, scene, animation);
                }else if(purpose==="amplitude"){
                    rectangle.setAmp(this.value);
                    let newAnim = new Animaitons(rectangle.getAmp(), rectangle.getFreq(), rectangle.getOff());
                    newAnim.modifyAnimation2D(rectangle.rectangleUp, scene, animation);
                    console.log("frequency arrrr:" +rectangle.getFreq());
                    console.log("amplitude arrrr:" +rectangle.getAmp());
                }else if(purpose==="position"){
                    rectangle.setOff(this.value);
                    let newAnim = new Animaitons(rectangle.getAmp(), rectangle.getFreq(), rectangle.getOff());
                    newAnim.modifyAnimation2D(rectangle.rectangleUp, scene, animation);
                    console.log("frequency arrrr:" +rectangle.getFreq());
                    console.log("amplitude arrrr:" +rectangle.getAmp());
                }
            } else {
                console.error("Animation is undefined inside onPointerUpObservable");
            }
        });
    }
    setActionPosition2D(rectangleUp: RectangleFactory){
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
            var Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
            rectangleUp.rotation=value*Deg2RadFactor;
            rectangleUp.centerX
        });
    }
    setActionFrequency2D(animation: Animatable,rectangle: animated2DRectangles,scene: Scene, positionVal: number){
        //Action on slider moved
        console.log("In slider check" + animation);
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
        // Action when slider thumb is released
        this.onPointerUpObservable.add(() => {
            if (animation) {
                    console.log("frequency arrrr:" +rectangle.getFreq());
                    rectangle.setFreq(this.value/10);
                    let newAnim = new Animaitons(180, rectangle.getFreq(), positionVal);
                    newAnim.modifyAnimation2D(rectangle.rectangleUp, scene, animation);
            } else {
                console.error("Animation is undefined inside onPointerUpObservable");
            }
        });
    }
    setActionAmplitude2D(animation: Animatable,rectangle: animated2DRectangles,scene: Scene){
        //Action on slider moved
        console.log("In slider check" + animation);
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
        // Action when slider thumb is released
        this.onPointerUpObservable.add(() => {
            if (animation) {
                rectangle.setAmp(this.value);
                let newAnim = new Animaitons(rectangle.getAmp(), 5, 0);
                newAnim.modifyAnimation2D(rectangle.rectangleUp, scene, animation);
            } else {
                console.error("Animation is undefined inside onPointerUpObservable");
            }
        });
    }
    setActionRelation2D(){
        //Action on slider moved
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
        // Action when slider thumb is released
        this.onPointerUpObservable.add(() => {
           //Logic for relation slider here
        });
    }

    setActionSliding3D(promise: Promise<Animatable>, scene: Scene,promiseMesh: Promise<BABYLON.AbstractMesh[]>,purpose: string,model: ModelFactory3D) {
        promise.then((animation) => {
            //Action on slider moved
            console.log("In slider check" + animation);
            this.onValueChangedObservable.add((value) => {
                console.log("New Rotation Y: 1 " + value.toFixed(1));
                this.associatedTextBlock.text = value.toFixed(1);
            });
            // Action when slider thumb is released
            this.onPointerUpObservable.add(() => {
                // This code will be executed when the slider thumb is released
                console.log("Slider thumb released. Final value: " + this.value.toFixed(1));

                // Check if animation is defined before using it
                if (animation) {
                    if(purpose==="frequency"){
                        console.log("frequency arrrr:" +model.getFreq());
                        model.setFreq(this.value);
                        let newAnim = new Animaitons(model.getAmp(), model.getFreq(), model.getOff());
                        newAnim.modifyAnimation3D(promiseMesh, scene, promise);
                    }else if(purpose==="amplitude"){
                        model.setAmp(this.value);
                        let newAnim = new Animaitons(model.getAmp(), model.getFreq(), model.getOff());
                        newAnim.modifyAnimation3D(promiseMesh, scene, promise);
                        console.log("frequency arrrr:" +model.getFreq());
                        console.log("amplitude arrrr:" +model.getAmp());
                    }else if(purpose==="position"){
                        model.setOff(this.value);
                        let newAnim = new Animaitons(model.getAmp(), model.getFreq(), model.getOff());
                        newAnim.modifyAnimation3D(promiseMesh, scene, promise);
                        console.log("frequency arrrr:" +model.getFreq());
                        console.log("amplitude arrrr:" +model.getAmp());
                    }
                } else {
                    console.error("Animation is undefined inside onPointerUpObservable");
                }
            });
        });
    }
}
