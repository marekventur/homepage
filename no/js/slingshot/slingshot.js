import {EntityManager} from "tiny-ecs";
import {Box, Physics, Ball, UserInteraction} from "./components";
import PhysicsSystem from "./systems/physics";
import SvgUpdaterSystem from "./systems/svg_updater";
import $ from "jquery";

export default class Slingshot {
    constructor(element) {
        this.element = element;

        this.entities = new EntityManager();

        this.addBoxes();
        this.addBalls();
        this.addEventListener();

        this.systems = [
            new PhysicsSystem(this.entities),
            new SvgUpdaterSystem(this.entities)
        ];
    }

    tick(time) {
        this.systems.forEach(system => system.tick(time));
    }

    addBoxes() {
        let boxes = this.element.querySelectorAll(".box");
        for (let i = 0; i < boxes.length; ++i) {
            let boxElement = boxes[i];

            let box =
                this.entities.createEntity()
                .addComponent(Box)
                .addComponent(Physics);

            box.box.initiate(boxElement);
        }
    }

    addBalls() {
        let balls = this.element.querySelectorAll(".ball");
        for (let i = 0; i < balls.length; ++i) {
            let ballElement = balls[i];

            let ball =
                this.entities.createEntity()
                .addComponent(Ball)
                .addComponent(Physics);

            ball.ball.initiate(ballElement);
        }
    }

    addEventListener() {
        let $element = $(this.element);

        $element.mousedown(event => {
            if (this.entities.queryComponents([UserInteraction]).length) {
                return; // there's already an entity
            }

            event.stopPropagation();
            $("body").addClass("no-selection");

            let userInteraction = this.entities.createEntity().addComponent(UserInteraction);
            let offset = $element.offset();

            userInteraction.userInteraction.x = event.clientX - offset.left;
            userInteraction.userInteraction.y = event.clientY - offset.top;

            $(document).mousemove(moveEvent => {
                userInteraction.userInteraction.x = moveEvent.clientX - offset.left;
                userInteraction.userInteraction.y = moveEvent.clientY - offset.top;
            });

            let mouseUpOrLeave = () => {
                this.entities.queryComponents([UserInteraction]).forEach(entity => entity.remove());
                $(document).off("mousemove");
                $("body").removeClass("no-selection");
            };

            $(document).mouseup(mouseUpOrLeave);
            $(document).mouseleave(mouseUpOrLeave);
        });
    }
}
