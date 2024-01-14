
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {GUIManager} from "./GUIMenager";
import {RectangleFactory} from "./RecrangleFactory";

export class animated2DRectangles {
    rectangleUp: RectangleFactory;
    rectangleDown: RectangleFactory;
    constructor(x: number,y: number) {
        //define two rectangles that will be used for the animation
        this.rectangleDown= new RectangleFactory(60,"35px",x,y,"#000000");
        this.rectangleUp= new RectangleFactory(60,"35px",x,y-25,"#000000");
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
}