import "@babylonjs/loaders";
import { AbstractMesh, Color3, Scene, SceneLoader, StandardMaterial } from "@babylonjs/core";

export class EdmoModel {
    private static readonly DEG2RADFACTOR = Math.PI / 180;
    private model: AbstractMesh[] | undefined;
    private armModel: AbstractMesh | undefined;
    private scene: Scene;

    private isLoaded = false;
    private _color: Color3 = new Color3(1, 1, 1);
    private colorIDArray = [new Color3(1, 0, 0.333333333), new Color3(0, 1, 0), new Color3(0, 0, 1), new Color3(1, 1, 0)];

    public constructor(scene: Scene, ID: number) {
        this.scene = scene;
        this.color = this.colorIDArray[ID % 4];
        console.log(ID);
        SceneLoader.ImportMesh("", "/Assets/Models/", "untitled.glb", scene, (loadedMeshes) => {
            this.model = loadedMeshes;
            let armModel = this.armModel = loadedMeshes[1];

            armModel.rotationQuaternion = null;
            armModel.rotation.y = -90 * EdmoModel.DEG2RADFACTOR;
            armModel.position.z = -63; // Why?

            loadedMeshes.forEach(mesh => {
                mesh.material = new StandardMaterial("material", scene);

                (mesh.material as StandardMaterial).diffuseColor = this._color;
            });
        }, (event) => {
            console.log(event.loaded, event.total);
        });
    }

    set color(value: Color3) {
        this._color = value;

        this.model?.forEach(mesh => {
            if (mesh.material as StandardMaterial)
                (mesh.material as StandardMaterial).diffuseColor = value;
        });
    }

    private _amplitude: number = 0;
    get amplitude() { return this._amplitude; }
    set amplitude(value: number) { this._amplitude = value; }

    private _frequency: number = 0;
    get frequency() { return this._frequency; }
    set frequency(value: number) { this._frequency = value; }

    private _offset: number = 90;
    get offset() { return this._offset; }
    set offset(value: number) { this._offset = value; }

    private currentPos: number = 0;

    public updateAnimation() {
        const deltaTime = this.scene.deltaTime / 1000;

        if (isNaN(deltaTime))
            return;

        this.currentPos = (this.currentPos + deltaTime) % (1 / this.frequency);
        const TWOPI = Math.PI * 2;

        let sin = (90 - this.offset + Math.sin(this.currentPos * TWOPI * this.frequency) * this.amplitude);

        sin = Math.min(90, Math.max(-90, sin)); //Clamp values

        if (this.armModel instanceof AbstractMesh) {
            this.armModel.rotation.x = sin * EdmoModel.DEG2RADFACTOR;
        }
    }
}
