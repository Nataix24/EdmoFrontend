
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {GUIManager} from "./GUIMenager";
import * as BABYLON from "@babylonjs/core";
import {Animatable, IAnimationKey, Scene} from "@babylonjs/core";
import {RectangleFactory} from "./RecrangleFactory";

export class Animaitons {
    amplitude: number;
    frequency: number;
    offset: number;

    constructor(Amplitude: number, Frequency: number, offset: number) {
       this.amplitude=Amplitude;
       this.frequency=Frequency;
       this.offset=offset;
    }
    modifyAnimation3D(promise: Promise<BABYLON.AbstractMesh[]>,scene: Scene,promiseanim: Promise<Animatable>){
        promiseanim.then((animation) => {
            promise.then((importedModel) => {
                let amplitude = this.amplitude/2;
                let offset = this.offset
                var Deg2RadFactor = 3.1415 / 180;

                const keysRot = [];
                keysRot.push({
                    frame: 0,
                    value: (offset - amplitude) * Deg2RadFactor
                });
                keysRot.push({
                    frame: 9,
                    value: (offset + amplitude) * Deg2RadFactor
                });
                var rotation = new BABYLON.Animation(
                    "armRotation",
                    "rotation.x",
                    this.frequency/5,
                    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                    BABYLON.Animation.ANIMATIONLOOPMODE_YOYO,


                );
                rotation.setKeys(keysRot);
                animation.stop("armRotation");
                animation = scene.beginDirectAnimation(importedModel[1], [rotation], 0, 9, true);
            });
        });
    }

    modifyAnimation2D(rectangle: RectangleFactory,scene: Scene,animation: Animatable){
        let amplitude = this.amplitude/2;
        let offset = this.offset
        var Deg2RadFactor = 3.1415 / 180;

        const keysRot = [];
        keysRot.push({
            frame: 0,
            value: (offset - amplitude) * Deg2RadFactor
        });
        keysRot.push({
            frame: 9,
            value: (offset + amplitude) * Deg2RadFactor
        });
        // Create width animation
        const rotAnimationForward = new BABYLON.Animation(
            "rotAnimation",
            "rotation",
            this.frequency,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_YOYO,
        );
        console.log("FRAMES: "+ this.frequency);
        rotAnimationForward.setKeys(keysRot);
        animation = scene.beginDirectAnimation(rectangle, [rotAnimationForward], 0, 10, true);
    }

}
