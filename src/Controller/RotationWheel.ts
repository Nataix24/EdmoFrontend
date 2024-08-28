import { LocalizationManager } from "../scripts/Localization";
import { PlayersPanel } from "./PlayersPanel";

interface Vector2 {
    x: number;
    y: number;
}

export class RelationWheel {
    public element: HTMLElement;

    private inputArea: HTMLElement;
    private dots: HTMLDivElement[] = [];

    private dotValues: number[] = [];

    private highlightInterval: any;
    private valueChangedCallback: (x: number) => void;

    private currentSpan: HTMLSpanElement = null!;

    public constructor(valueChangedCallback: (x: number) => void) {
        this.valueChangedCallback = valueChangedCallback;
        const element = this.element = document.createElement("div");

        const header = document.createElement("h2");
        header.innerText = "Relation";
        LocalizationManager.setLocalisationKey(header, "relation");

        element.appendChild(header);

        const inputArea = this.inputArea = document.createElement("div");
        inputArea.style.display = "flex";
        inputArea.style.justifyContent = "center";
        //inputArea.setAttribute("draggable", "true");
        inputArea.appendChild(this.createCircle());

        inputArea.addEventListener("pointerdown", this.dragMouseDown.bind(this));
        element.appendChild(inputArea);
    }

    public highlight() {
        if (this.highlightInterval)
            this.unhighlight();

        this.element.style.animationName = "highlight";
        this.highlightInterval = setInterval(this.unhighlight.bind(this), 5000);
    }
    public unhighlight() {
        this.element.style.animationName = "";
        clearInterval(this.highlightInterval);
        this.highlightInterval = null;
    }

    private id = -1;

    public setID(id: number) {
        this.id = id;
        this.dots[id].style.zIndex = "999";
    }

    private createCircle(): HTMLDivElement {
        const circleElement = document.createElement("div");
        circleElement.className = "diWheel";
        this.currentSpan = document.createElement("span");
        this.currentSpan.className = "relationText";
        this.currentSpan.textContent = "0";

        circleElement.appendChild(this.currentSpan);
        let thisDial: HTMLDivElement;
        for (let i = 3; i >= 0; --i) {
            circleElement.appendChild(this.dots[i] = this.createDot(i));
        }

        return circleElement;
    }
    private createDot(id: number) {
        const div = document.createElement("div");

        div.className = "diDotWrapper";
        const dotElement = document.createElement("div");
        dotElement.className = "diDot";
        dotElement.style.backgroundColor = `hsl(${PlayersPanel.hues[id]}, 50%, 65%)`;

        div.appendChild(dotElement);

        return div;
    }

    private onMouseEvent(e: MouseEvent) {
        const mousepos: Vector2 = { x: e.x, y: e.y };

        const rect = this.inputArea.getBoundingClientRect();
        const minDim = Math.min(rect.width, rect.height);
        const origin: Vector2 = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };

        const distanceSquared = Math.pow(mousepos.x - origin.x, 2) + Math.pow(mousepos.y - origin.y, 2);
        if (distanceSquared > Math.pow(minDim / 2, 2) * 2)
            return;

        const angle = RelationWheel.GetDegreesFromPosition(origin, mousepos);

        this.setPosition(this.id, angle, true);
    }

    private static readonly DEG2RADFACTOR = Math.PI / 180;

    /// <summary>
    /// Computes a vector with the same angle as <c>angle</c>, and is along the circumference with radius <c>distance</c>
    /// </summary>
    /// <param name="distance">Length of the vector</param>
    /// <param name="angle">Angle of vector in degrees</param>
    public static GetCircularPosition(distance: number, angle: number): Vector2 {
        // This is offset by 90 degrees since I use the vertical-up system (like a compass)
        const radians = (angle + 90) * this.DEG2RADFACTOR;

        const sin = Math.sin(radians);
        const cos = Math.cos(radians);

        // Taking advantage of the assumption is that the y axis points downwards
        // Only I use this, so it's acceptable
        return { x: -distance * cos, y: -distance * sin };
    }

    /// <summary>
    /// Computes the angle (in degrees) of <c>target</c> around <c>origin</c>
    /// </summary>
    public static GetDegreesFromPosition(origin: Vector2, target: Vector2) {
        const direction: Vector2 = {
            x: target.x - origin.x,
            y: target.y - origin.y
        };

        const angle = Math.atan2(direction.y, direction.x) / this.DEG2RADFACTOR;

        return (angle + 90);
    }

    private dragMouseDown(e: MouseEvent) {
        if (this.id == -1)
            return;
        if (e.button != 0)
            return;
        e.preventDefault();

        this.onMouseEvent(e);

        document.onpointerup = this.closeDragElement;
        // call a function whenever the cursor moves:
        document.onpointermove = this.onMouseEvent.bind(this);
    }

    private closeDragElement() {
        // stop moving when mouse button is released:
        document.onpointerup = null;
        document.onpointermove = null;
    }

    private setPosition(index: number, angle: number, userTriggered = false) {
        if (this.dotValues[index] == undefined || isNaN(this.dotValues[index]))
            this.dotValues[index] = 0;

        const delta = Math.round(RelationWheel.GetDeltaAngle(this.dotValues[index], angle));

        if (delta == 0)
            return;

        this.dotValues[index] += delta;
        this.dots[index].style.transform = `rotate(${this.dotValues[index]}deg)`;
        const modded = RelationWheel.Mod(angle, 360);

        if (index == this.id)
            this.currentSpan.textContent = `${modded.toFixed(0)}`;

        if (userTriggered)
            this.valueChangedCallback(modded);
    }

    public static GetDeltaAngle(a: number, b: number) {
        a = RelationWheel.Mod(a, 360);
        b = RelationWheel.Mod(b, 360);

        let delta = b - a;

        delta = RelationWheel.Mod(delta, 360);

        while (delta < -180)
            delta += 360;
        while (delta > 180)
            delta -= 360;

        return delta;
    }

    public static Mod(a: number, b: number) {
        return (a %= b) < 0 ? a + b : a;
    }

    public setValueOf(index: number, x: number) {
        this.setPosition(index, x);
    }
}