import raf from "raf";
import Box from "./objects/box";
import Physics from "./physics/box2d_physics";

export default class SlingshotGame {
    constructor(element) {
        this.element = element;

        this.boxes = Box.createAll(element);

        raf(() => this.tick());

        this.physics = new Physics();

        physics.setupDebugDraw(document.getElementById("canvas"));

        this.boxes.forEach(box => this.physics.addBox(box));

    }

    tick() {
        this.physics.tick();

        this.physics.debugDraw();

        this.boxes.forEach(object => {
            object.updateDom();
        });

    }


}