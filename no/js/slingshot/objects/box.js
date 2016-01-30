import DomObject from "./dom_object";

export default class Box extends DomObject {
    constructor(element) {
        super(element, ["Transform"]);

        let transform = element.getAttribute("transform").match(/translate\((\d+), (\d+)\) rotate\((\d+)\)/);
        this.x = parseInt(transform[1], 10);
        this.y = parseInt(transform[2], 10);
        this.angle = parseInt(transform[3], 10) / 180 * Math.PI;
        let rect = element.querySelector("rect");
        this.height = parseInt(rect.getAttribute("height"), 10) + 2;
        this.width = parseInt(rect.getAttribute("width"), 10) + 2;
    }

    calculateTransform() {
        let x = this.roundPosition(this.x);
        let y = this.roundPosition(this.y);
        let angle = this.roundAngle(this.angle * 180 / Math.PI);
        return `translate(${x}, ${y}) rotate(${angle})`;
    }

    static createAll(root) {
        let boxes = root.querySelectorAll(".box");
        let result = [];
        for (let i = 0; i < boxes.length; i++) {
            result.push(new Box(boxes[i]));
        }
        return result;
    }
}
