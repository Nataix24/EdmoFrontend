import { ArcRotateCamera, BinaryFileAssetTask, Color3, Color4, Engine, HemisphericLight, Layer, Scene, SceneOptions, Vector3, Viewport } from "@babylonjs/core";
import { EdmoModel } from "./EdmoModel";
import { EdmoProperty } from "./EdmoProperty";

export class ControllerScene extends Scene {
    private readonly edmoModel: EdmoModel = null!;
    public constructor(canvas: HTMLCanvasElement, engine: Engine, options?: SceneOptions | undefined) {
        super(engine, options);

        const light = new HemisphericLight("Global lights", new Vector3(0, 1, 0), this);
        light.diffuse = new Color3(1, 1, 1);
        light.specular = new Color3(1, 1, 1);
        light.groundColor = new Color3(0.4, 0.4, 0.4);

        const camera = new ArcRotateCamera("Camera2", 0.4, 0.9, 260, Vector3.ZeroReadOnly, this);
        camera.attachControl(canvas, true);
        this.edmoModel = new EdmoModel(this);
        this.clearColor = new Color4(0, 0, 0, 0);
    }

    public Update() {
        this.edmoModel?.updateAnimation();
        if (isNaN(this.deltaTime))
            return;
    }


    public updateEdmoModel(type: EdmoProperty, value: number) {
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
    }
}
