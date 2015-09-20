import {Box, Ball} from "../components";

export default class SvgUpdaterSystem {
    constructor(entities) {
        this.entities = entities;
    }

    tick() {
        this.entities.queryComponents([Box]).forEach(box => {
            let {x, y, angle, oldX, oldY, oldAngle} = box.box;

            if (x !== oldX || y !== oldY || angle !== oldAngle) {
                box.box.element.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle * 180 / Math.PI})`);
                box.oldX = x;
                box.oldY = y;
                box.oldAngle = angle;
            }

            box.box.element.setAttribute("style", box.physics.body.isSleeping ? "fill:red;" : "");
        });

        this.entities.queryComponents([Ball]).forEach(ball => {
            let {x, y, oldX, oldY} = ball.ball;

            //console.log(ball.ball.element);

            if (x !== oldX || y !== oldY ) {
                ball.ball.element.setAttribute("cx", x);
                ball.ball.element.setAttribute("cy", y);
                ball.oldX = x;
                ball.oldY = y;
            }

        });
    }
}
