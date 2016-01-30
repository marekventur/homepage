import raf from "raf";
import Box from "./objects/box";
import Ball from "./objects/ball";
import Physics from "./physics/box2d_physics";
import $ from "jquery";

export default class SlingshotGame {
    constructor(element) {
        this.element = element;

        this.boxes = Box.createAll(element);
        this.balls = Ball.createAll(element);

        raf(() => this.tick());

        this.physics = new Physics(this.balls);

        this.boxes.forEach(box => this.physics.addBox(box));

        this.setupMouseInteraction();
    }

    tick() {
        this.physics.tick();

        this.boxes.forEach(object => object.updateDom());
        this.balls.forEach(object => object.updateDom());

    }

    setupMouseInteraction() {
        let $element = $(this.element);

        $element.mousedown(event => {
            if (this.mouseIsDown) {
                return;
            }

            this.mouseIsDown = true;

            event.stopPropagation();
            $("body").addClass("no-selection");

            let offset = $element.offset();

            this.physics.mouseDown(event.clientX - offset.left, event.clientY - offset.top);

            $(document).mousemove(moveEvent => {
                this.physics.mouseMove(moveEvent.clientX - offset.left, moveEvent.clientY - offset.top);
            });

            let mouseUpOrLeave = moveEvent => {
                this.mouseIsDown = false;
                $(document).off("mousemove").off("mouseleave");
                $("body").removeClass("no-selection");
                this.physics.mouseUp(moveEvent.clientX - offset.left, moveEvent.clientY - offset.top);
            };

            $(document).mouseup(mouseUpOrLeave);
            $(document).mouseleave(mouseUpOrLeave);
        });
    }
}