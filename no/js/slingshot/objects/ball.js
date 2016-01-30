import DomObject from "./dom_object";

export default class Ball extends DomObject {
    constructor(element) {
        super(element, ["Cx", "Cy"]);

        this.x = parseInt(element.getAttribute("cx"), 10);
        this.y = parseInt(element.getAttribute("cy"), 10);
        this.radius = parseInt(element.getAttribute("r"), 10);
    }

    calculateCx() { return this.x; }
    calculateCy() { return this.y; }

    static createAll(root) {
        let balls = root.querySelectorAll(".ball");
        let result = [];
        for (let i = 0; i < balls.length; i++) {
            result.push(new Ball(balls[i]));
        }
        return result;
    }
}