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
            this.edmoModel = new EdmoModel(this, edmoClient.ID);
            this.GUI = new EdmoGUI();
        }

        this.GUI.onSliderChanged(this.updateEdmoModel.bind(this));
        this.client.OnDataChannelMessage(this.onDataChannelMessage.bind(this));
    }

    public Update() {
        this.edmoModel?.updateAnimation();
        if (isNaN(this.deltaTime))
            return;

        this.GUI?.Update(this.deltaTime / 1000);
    }

    private onDataChannelMessage(message: string) {
        if (message.startsWith("freq")) {
            this.GUI.UpdateFrequencySlider(parseFloat(message.substring(5)));
        }
    }

    private updateEdmoModel(type: EdmoProperty, value: number, userAdjusted: boolean) {
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

        if (!userAdjusted)
            return;

        const DEG2RADFACTOR = Math.PI / 180;

        switch (type) {
            case EdmoProperty.Offset:
                this.client.sendMessage(`off ${value}`);
                break;
            case EdmoProperty.Frequency:
                this.client.sendMessage(`freq ${value}`);
                break;
            case EdmoProperty.Amplitude:
                this.client.sendMessage(`amp ${value}`);
            case EdmoProperty.Relation:
                this.client.sendMessage(`phb ${value * DEG2RADFACTOR}`);
                break;
        }
    }
}
