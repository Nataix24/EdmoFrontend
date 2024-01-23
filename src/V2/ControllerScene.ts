import { ArcRotateCamera, BinaryFileAssetTask, Color3, Engine, HemisphericLight, Layer, Scene, SceneOptions, Vector3, Viewport } from "@babylonjs/core";
import { EdmoModel } from "./EdmoModel";
import { EdmoGUI } from "./EdmoGUI";
import { EdmoProperty } from "./EdmoProperty";
import { Edmo2DGUI } from "./Edmo2DGUI";
import { EDMOClient } from "../EDMOClient";

export class ControllerScene extends Scene {
    private readonly edmoModel: EdmoModel = null!;
    private readonly GUI: EdmoGUI | Edmo2DGUI;
    private readonly client: EDMOClient;

    public constructor(SimpleView: boolean, edmoClient: EDMOClient, canvas: HTMLCanvasElement, engine: Engine, options?: SceneOptions | undefined) {
        super(engine, options);
        this.client = edmoClient;

        const light = new HemisphericLight("Global lights", new Vector3(0, 1, 0), this);

        const camera = new ArcRotateCamera("Camera2", 0.4, 0.9, 260, Vector3.ZeroReadOnly, this);
        camera.attachControl(canvas, true);

        if (SimpleView) {
            this.GUI = new Edmo2DGUI();
        }
        else {
            this.edmoModel = new EdmoModel(this);
            this.edmoModel.color = new Color3(1, 0, 0.33333333333);
            this.GUI = new EdmoGUI();
        }

        this.GUI.onSliderChanged(this.updateEdmoModel.bind(this));
    }

    public Update() {
        this.edmoModel?.updateAnimation();
        if (isNaN(this.deltaTime))
            return;

        this.GUI?.Update(this.deltaTime / 1000);
    }

    private updateEdmoModel(type: EdmoProperty, value: number) {
        if (this.edmoModel)
            switch (type) {
                case EdmoProperty.Offset:
                    this.edmoModel.offset = value;
                    break;
                case EdmoProperty.Frequency:
                    this.edmoModel.frequency = value;
                    break;
                case EdmoProperty.Amplitude:
                    this.edmoModel.amplitude = value;
                    break;
            }

        switch (type) {
            case EdmoProperty.Offset:
                this.client.sendMessage(`off ${value}`);
                break;
            case EdmoProperty.Frequency:
                this.client.sendMessage(`freq ${value}`);
                break;
            case EdmoProperty.Amplitude:
                this.client.sendMessage(`amp ${value}`);
                break;
        }
    }
}
