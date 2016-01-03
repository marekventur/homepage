import {Box, Ball, Enemy} from "../components";

export default class SvgUpdaterSystem {
    constructor(entities) {
        this.entities = entities;
    }

    tick() {
        this.entities.queryComponents([Box]).forEach(box => {
            let {x, y, angle, oldX, oldY, oldAngle} = box.box;

            x = this.roundPosition(x);
            y = this.roundPosition(y);
            angle = this.roundPosition(angle * 180 / Math.PI);

            if (x !== oldX || y !== oldY || angle !== oldAngle) {
                box.box.element.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);
                box.oldX = x;
                box.oldY = y;
                box.oldAngle = angle;
            }

            box.box.element.setAttribute("style", box.physics.body.isSleeping ? "fill:red;" : "");
        });

        this.entities.queryComponents([Ball]).forEach(ball => {
            let {x, y, oldX, oldY} = ball.ball;

            x = this.roundPosition(x);
            y = this.roundPosition(y);

            if (x !== oldX || y !== oldY ) {
                ball.ball.element.setAttribute("cx", x);
                ball.ball.element.setAttribute("cy", y);
                ball.oldX = x;
                ball.oldY = y;
            }

        });

        this.entities.queryComponents([Enemy]).forEach(enemy => {
            let {x, y, angle, oldX, oldY, oldAngle} = enemy.enemy;

            x = this.roundPosition(x);
            y = this.roundPosition(y);
            angle = this.roundPosition(angle * 180 / Math.PI);

            if (x !== oldX || y !== oldY || angle !== oldAngle) {
                enemy.enemy.element.setAttribute("transform", `translate(${x}, ${y}) rotate(${angle})`);
                enemy.oldX = x;
                enemy.oldY = y;
                enemy.oldAngle = angle;
            }

            enemy.enemy.element.setAttribute("style", enemy.physics.body.isSleeping ? "fill:red;" : "");

        });
    }

    roundPosition(input) {
        return Math.round(input * 10) / 10;
    }

    roundAngle(input) {
        return Math.round(input * 1000) / 1000;
    }
}
