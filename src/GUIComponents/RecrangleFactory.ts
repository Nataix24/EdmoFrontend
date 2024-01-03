
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';

    export class RecrangleFactory extends GUI.Rectangle{

        constructor(width: number, height: string | number, x: string | number, y: string | number, color: string) {
            super();
            this.widthInPixels = width;
            this.height = height;
            this.top=y;
            this.left=x;
            this.color=color;
        }
        /**
         * Method that defines a 2D Rectangle in desired coordinates
         * @returns {Rectangle}
         */
        createRectangle() {
            this.background = "#9C5586FF"; // Set the desired background color
            this.cornerRadius = 20; // Set the corner radius
            this.alpha = 0.74;
            this.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT; // Align to the left
            this.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Align to the top
            this.paddingRight = 40;
            return this;
        }
    }
