import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';

export class LabelFactory extends GUI.TextBlock{

    constructor(text: string | number, x: string | number, y: string | number, outlineColor: string, color: string) {
        super();
        this.text = text.toString();
        this.top=y;
        this.left=x;
        this.outlineColor=outlineColor;
        this.color=color;
    }
    /**
     * This function defines a label in a 2D space
     * @returns {TextBlock}
     */
     createLabel() {
        this.height = "30px";
        this.fontFamily = "Courier New"; // Set the font style
        this.fontSize = 24;
        this.outlineWidth = 1; // Set the outline width
        this.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Align to the left
        this.paddingLeft = 40;
        this.paddingRight = 40;
        return this;
    }
}