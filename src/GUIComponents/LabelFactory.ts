import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {GUIManager} from "./GUIMenager";
import {TaskManager} from "../taskMenager";

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
    setWidth(width:number){
        this.width=width;
    }

    setActionLabel(taskList: TaskManager,indexOf: number, labelToChange: LabelFactory){
         if(indexOf>0 && indexOf<3) {
             //when searching through tasks
             this.onPointerClickObservable.add(() => {
                 if (this.text === "Next") {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = indexOf + 1;
                     console.log("Next");
                     console.log("value: "+ indexOf);
                     console.log("tasklist size:  "+taskList.size());
                     return indexOf;
                 } else {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = indexOf - 1;
                     console.log("Previous");
                     console.log("value: "+ indexOf);
                     console.log("I am in >0");
                     return indexOf;
                 }
             });
         }else if (indexOf==0){
             //when searching through tasks
             this.onPointerClickObservable.add(() => {
                 if (this.text === "Next") {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = indexOf + 1;
                     console.log("Next");
                     console.log("value: "+ indexOf);
                     console.log("I am in ==0");
                     return indexOf;
                 } else {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = 0;
                     console.log("Previous");
                     console.log("value: "+ indexOf);
                     return indexOf;
                 }
             });
         }else if (indexOf==taskList.size()){
             //when searching through tasks
             this.onPointerClickObservable.add(() => {
                 if (this.text === "Next") {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = taskList.size();
                     console.log("Next in tasklist");
                     console.log("I am in =3");
                     console.log("value: "+ indexOf);
                     return indexOf;
                 } else {
                     labelToChange.text = taskList.getTask(indexOf);
                     indexOf = indexOf -1;
                     console.log("Previous");
                     console.log("value: "+ indexOf);
                     return indexOf;
                 }
             });
         }
        console.log("non return");
        return indexOf;
    }
}