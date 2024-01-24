import { Rectangle, StackPanel } from "@babylonjs/gui";
import { IUpdatable } from "./IUpdatable";
import { EdmoProperty } from "./EdmoProperty";

export class EdmoRectVisual extends StackPanel implements IUpdatable {
    private static readonly DEG2RADFACTOR = Math.PI / 180;
    private topRect: Rectangle;

    public constructor() {
        super();

        this.heightInPixels = this.widthInPixels = 40;
        this.isVertical = true;

        // Create top rect
        let topRect = this.topRect = new Rectangle();
        this.topRect.heightInPixels = 20;
        this.topRect.widthInPixels = 10;
        this.topRect.transformCenterY = 1;

        // Create bottom rect
        let bottomRect = new Rectangle();
        bottomRect.heightInPixels = 20;
        bottomRect.widthInPixels = 10;

        this.addControl(topRect);
        this.addControl(bottomRect);
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

    public Update(deltaTime: number): void {
        this.currentPos = (this.currentPos + deltaTime) % (1 / this.frequency);

        const TWOPI = Math.PI * 2;
        let sin = (90 - this.offset + Math.sin(this.currentPos * TWOPI * this.frequency) * this.amplitude);

        this.topRect.rotation = sin * EdmoRectVisual.DEG2RADFACTOR;
    }

    public adjustProperty(prop: EdmoProperty, value: number) {
        switch (prop) {
            case EdmoProperty.Offset:
                this.offset = value;
                break;
            case EdmoProperty.Frequency:
                this.frequency = value;
                break;
            case EdmoProperty.Amplitude:
                this.amplitude = value;
                break;
        }
    }

}
