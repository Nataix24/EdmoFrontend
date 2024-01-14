import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import * as BABYLON from "@babylonjs/core";
import {GUIManager} from "./GUIMenager";
import {RectangleFactory} from "./RecrangleFactory";

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
    setActionSliding() {
        //Action on slider moved
        this.onValueChangedObservable.add((value) => {
            console.log("New Rotation Y: 1 " + value.toFixed(1));
            this.associatedTextBlock.text = value.toFixed(1);
        });
    }
    setActionSlidingPosition(promise: Promise<BABYLON.AbstractMesh[]>): void {
        promise.then((importedModel) => {
            this.onValueChangedObservable.add((value) => {
                        this.associatedTextBlock.text = value.toFixed(1);
                        var Deg2RadFactor = 3.1415 / 180; // Babylon's rotation is in radians
                        importedModel[1].rotation.x = value * Deg2RadFactor;
                        console.log("New Rotation Y: 1 " + value.toFixed(1));
                    });
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

}
