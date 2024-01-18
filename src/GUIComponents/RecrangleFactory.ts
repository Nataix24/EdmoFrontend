
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {GUIManager} from "./GUIMenager";
import * as BABYLON from "@babylonjs/core";

    export class RectangleFactory extends GUI.Rectangle{
    clicked: boolean;
        constructor(width: number, height: string | number, x: string | number, y: string | number, color: string) {
            super();
            this.clicked=true;
            this.widthInPixels = width;
            this.height = height;
            this.top=y;
            this.left=x;
            this.color=color;
        }
        setWidth(width: number){
            this.widthInPixels=width
        }
        /**
         * Method that defines a 2D Rectangle in desired coordinates
         * @returns {Rectangle}
         */
        createRectangle() {
            this.background = "#9C5586FF"; // Set the desired background color
            this.cornerRadius = 20; // Set the corner radius
            this.alpha = 0.74;
            this.paddingRight = 40;
            return this;
        }
        setBackGroundColor(color: string){
            this.background = color;
        }
        setPadding(value: number){
            this.cornerRadius=value;
        }
        setActionButton(guiManager: GUIManager){
            this.onPointerClickObservable.add(() => {
                if(this.clicked) {
                    guiManager.switchGUI(this.clicked);
                    this.clicked=false;
                }else{
                    guiManager.switchGUI(this.clicked);
                    this.clicked=true;
                }
            });
        }
    }
