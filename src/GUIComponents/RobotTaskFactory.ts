
import "@babylonjs/loaders";
import * as GUI from '@babylonjs/gui/2D';
import {RectangleFactory} from "./RecrangleFactory";
import {LabelFactory} from "./LabelFactory";
import {Task, TaskManager} from "../taskMenager";
export class RobotTaskFactory extends GUI.Rectangle{
    private taskManager: TaskManager = new TaskManager();
    private taskText: LabelFactory;
    nextLabel: LabelFactory;
    currentTaskNumber: number;
    previousLabel: LabelFactory;
    /**
     * Method that defines all the tasks
     */
     defineTasks() {
        // Create instances of Task
        const task1 = new Task('Find the parameters that will make the robot walk');
        const task2 = new Task('Walk the robot to the mountain');
        const task3 = new Task('make the robot run as fast as possible');
        // Add tasks to the TaskManager
        this.taskManager.addTask(task1);
        this.taskManager.addTask(task2);
        this.taskManager.addTask(task3);
    }

    associatedTexture: GUI.AdvancedDynamicTexture;
    // Array to store paths of individual robot images
    private robotImages: string[] = [
        "./Assets/Textures/robot1.png",
        "./Assets/Textures/robot2.png",
        "./Assets/Textures/robot3.png",
        "./Assets/Textures/robot4.png"
    ];

    constructor(advancedTexture: GUI.AdvancedDynamicTexture) {
        super();
        this.associatedTexture=advancedTexture;
        this.defineTasks();
        this.currentTaskNumber=0;
    }
    createImage(nameImg: string,urlImg: string) {
        const image = new GUI.Image("robotImage", "./Assets/Textures/robot1.png");
        image.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT; // Align to the left
        image.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM; // Align to the top
        image.widthInPixels = 300;
        image.heightInPixels = 300;
        this.associatedTexture.addControl(image);
        return image;
    }
    createAnimation(robotImg: GUI.Image){
        //  Task logic
        let isTaskPressed = false; //Defining a flag booblean for task toggling
        let cloud = new RectangleFactory(600, "300px", 0, 0, "white");
        cloud.horizontalAlignment=GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Align to the left
        cloud.verticalAlignment=GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Align to the left
        //  logic behind pressing the robot image
        robotImg.onPointerClickObservable.add(() => {
            // If the task is not displayed then create the task
            if (!isTaskPressed) {
                console.log("in create loop");
                // Robot animation waving hand up
                this.imageAnimationWaveUp(cloud,robotImg);
                isTaskPressed = true;
            }
            else if (isTaskPressed) {
                console.log("in dispose loop");
                this.imageAnimationWaveDown(cloud,robotImg);
                isTaskPressed = false;
            }
        });
    }
    imageAnimationWaveUp(cloud: RectangleFactory, robotImg: GUI.Image){
        const changeImagesWithDelay = async () => {
            for (let i = 0; i < this.robotImages.length; i++) {
                robotImg.source = this.robotImages[i];

                // Introduce a delay of 1000 milliseconds (1 second) before the next iteration
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        };
        changeImagesWithDelay();
        //Create task frame
        cloud.createRectangle();
        cloud.background = "white";
        this.associatedTexture.addControl(cloud);
        //Adding text to the cloud
        this.taskText = new LabelFactory(this.taskManager.getTask(this.currentTaskNumber), 0, 0, "black", "black").createLabel();
        //add next task label
        this.nextLabel = new LabelFactory("Next", 100, 50, "black", "black").createLabel();
        this.nextLabel.setWidth(0.3);
        this.currentTaskNumber=this.nextLabel.setActionLabel(this.taskManager,this.currentTaskNumber,this.taskText);
        //add previous task label
        this.previousLabel = new LabelFactory("Previous", -100, 50, "black", "black").createLabel();
        this.previousLabel.setWidth(0.4);
        this.currentTaskNumber=this.previousLabel.setActionLabel(this.taskManager,this.currentTaskNumber,this.taskText);
        cloud.addControl(this.taskText);
        cloud.addControl(this.nextLabel);
        cloud.addControl(this.previousLabel);
    }
    imageAnimationWaveDown(cloud: RectangleFactory, robotImg: GUI.Image){
        cloud.dispose();
        const changeImagesWithDelay = async () => {
            for (let i = this.robotImages.length; i >= 0; i--) {
                robotImg.source = this.robotImages[i];

                // Introduce a delay of 1000 milliseconds (1 second) before the next iteration
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        };
        changeImagesWithDelay();
    }

}
