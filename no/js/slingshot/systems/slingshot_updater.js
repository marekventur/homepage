import {Ball} from "../components";

const ORIGIN = {
    back: {x: 147, y: 367},
    front: {x: 119, y: 367},
    middle: {x: 133, y: 367}
};

const BALL_RADIUS = 13;

export default class SlingshotUpdaterSystem {
    constructor(entities, frontElastic, backElastic) {
        this.entities = entities;
        this.elastic = {
            front: frontElastic,
            back: backElastic
        };
    }

    tick() {
        let activeBall = this.entities.queryComponents([Ball]).find(ball => ball.ball.active);

        if (activeBall) {
            // Calculate point where elastics attach
            let dMiddleX = ORIGIN.middle.x - activeBall.ball.x;
            let dMiddleY = ORIGIN.middle.y - activeBall.ball.y;

            // normalise
            let magnitude = Math.sqrt(
                Math.pow(dMiddleX, 2) +
                Math.pow(dMiddleY, 2)
            );
            dMiddleX /= magnitude;
            dMiddleY /= magnitude;

            let elasticEndPoint = {
                x: activeBall.ball.x - dMiddleX * (BALL_RADIUS + 1),
                y: activeBall.ball.y - dMiddleY * (BALL_RADIUS + 1)
            };

            // Back
            ["front", "back"].forEach(type => {
                let dx = ORIGIN[type].x - elasticEndPoint.x;
                let dy = ORIGIN[type].y - elasticEndPoint.y;

                let length = Math.sqrt(
                    Math.pow(dx, 2) +
                    Math.pow(dy, 2)
                ) + 4;

                let angle = (Math.PI * 1.5 - Math.atan2(dx, dy)) * 180 / Math.PI;

                this.elastic[type].setAttribute("width", this.roundLength(length));
                this.elastic[type].setAttribute("transform", `rotate(${this.roundAngle(angle)}, ${ORIGIN[type].x}, ${ORIGIN[type].y})`);
            });

        } else {
            this.elastic.back.setAttribute("width", 36);
            this.elastic.back.setAttribute("transform", `rotate(115, ${ORIGIN.back.x}, ${ORIGIN.back.y})`);
            this.elastic.front.setAttribute("width", 36);
            this.elastic.front.setAttribute("transform", `rotate(424, ${ORIGIN.front.x}, ${ORIGIN.front.y})`);
        }
    }

    roundLength(input) {
        return Math.round(input * 10) / 10;
    }

    roundAngle(input) {
        return Math.round(input * 1000) / 1000;
    }
}
