import "@babylonjs/loaders";
import { AbstractMesh, Color3, CreateSphere, MeshBuilder, Scene, SceneLoader, StandardMaterial, Vector3 } from "@babylonjs/core";

export class EdmoModel {
    private static readonly DEG2RADFACTOR = Math.PI / 180;
    public model: AbstractMesh = null!;
    public root: AbstractMesh = null!;
    public boundingSphere: AbstractMesh = null!;
    private armModel: AbstractMesh = null!;
    private scene: Scene;

    private _color: Color3 = new Color3(0.8, 0.8, 0.8);

    public constructor(scene: Scene) {
        this.scene = scene;
    }

    public async loadAsync() {
        let loadedMeshes = await SceneLoader.ImportMeshAsync("", "/Models/", "untitled.glb", this.scene);
        this.model = loadedMeshes.meshes[0];

        for (const mesh of this.model.getChildMeshes()) {
            mesh.renderOutline = true;
            mesh.outlineColor = new Color3(0.4, 0.4, 0.4);
            mesh.outlineWidth = 1;
            mesh.material = new StandardMaterial("material", this.scene);
            (mesh.material as StandardMaterial).diffuseColor = this._color;
            mesh.normalizeToUnitCube(true);
        }

        this.boundingSphere = CreateSphere("t", { diameter: 1.5 });
        this.boundingSphere.setEnabled(false);

        const armModel = this.armModel = loadedMeshes.meshes[1];
        armModel.rotationQuaternion = null;
        armModel.rotation.y = -90 * EdmoModel.DEG2RADFACTOR;
    }

    set color(value: Color3) {
        this._color = value;

        this.model.getChildMeshes(true)?.forEach(mesh => {
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
