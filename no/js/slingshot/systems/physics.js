import {Physics, Box, Ball, UserInteraction} from "../components";
import {Engine, World, Body, Vertices, Bodies, Runner, Constraint, Events} from "matter-js/src/module/main";
import _ from "underscore";

const DEPTH_BOX_BREAK_THRESHOLD = 10;

export default class PhysicsSystem {
    constructor(entities) {
        this.entities = entities;
        this.engine = Engine.create({
            render: {
                controller: NoopRenderer
            },
            enableSleeping: true
        }
        /*{
            render: {
                canvas: document.querySelector("canvas"),
                options: {
                    width: 2000,
                    height: 470,
                    background: "transparent",
                    wireframeBackground: "transparent",
                    hasBounds: false,
                    enabled: true,
                    wireframes: true,
                    showSleeping: true,
                    showDebug: false,
                    showBroadphase: false,
                    showBounds: false,
                    showVelocity: false,
                    showCollisions: false,
                    showAxes: false,
                    showPositions: false,
                    showAngleIndicator: false,
                    showIds: false,
                    showShadows: false
                }
            },
            enableSleeping: false
        }*/
        );

        let initialBall = this.getBalls()[0];
        initialBall.ball.active = true;
        this.initialPoint = { x: initialBall.ball.x, y: initialBall.ball.y };

        let bodies = _.flatten([
            this.createGround(),
            this.createBoxes(),
            this.createBall(initialBall),
            this.createElastics()
        ]);

        World.add(this.engine.world, bodies);
        this.runner = Runner.create();

        this.listenToEvents();
    }

    tick(time) {
        Runner.tick(this.runner, this.engine, time);

        this.getBoxes().forEach(box => {
            box.box.x = box.physics.body.position.x;
            box.box.y = box.physics.body.position.y;
            box.box.angle = box.physics.body.angle;
        });

        this.getBalls().forEach(ball => {
            if (ball.physics.body) {
                ball.ball.x = ball.physics.body.position.x;
                ball.ball.y = ball.physics.body.position.y;

                if (ball.ball.active && ball.ball.x > 140) {
                    this.nextBall();
                }
            }
        });

        this.checkPull();
    }

    getBoxes() {
        return this.entities.queryComponents([Physics, Box]);
    }

    getBalls() {
        return this.entities.queryComponents([Physics, Ball]);
    }

    getCurrentBall() {
        return this.getBalls().find(ball => ball.ball.active);
    }

    createGround() {
        let ground = Bodies.rectangle(0, 520, 10000, 100, { isStatic: true });
        ground.friction = 0.9;
        return ground;
    }

    createElastics() {
        let initialBall = this.getBalls()[0];

        this.interactionConstraint = Constraint.create({
            pointA: {x: this.initialPoint.x, y: this.initialPoint.y},
            bodyB: initialBall.physics.body,
            stiffness: 0.9
        });

        this.elastics = [
            Constraint.create({
                pointA: { x: 119, y: 367 },
                bodyB: initialBall.physics.body,
                stiffness: 0.05
            }),
            Constraint.create({
                pointA: { x: 147, y: 367 },
                bodyB: initialBall.physics.body,
                stiffness: 0.05
            }),
            this.interactionConstraint
        ];
        return this.elastics;
    }

    createBoxes() {
        return this.getBoxes().map(box => {
            let body = Body.create({
                label: "Rectangle Body",
                position: { x: box.box.x, y: box.box.y },
                vertices: Vertices.fromPath(`L 0 0 L ${box.box.width} 0 L ${box.box.width} ${box.box.height} L 0 ${box.box.height}`),
                angle: box.box.angle,
                friction: 0.005
            });
            body.isBox = true;
            body.entity = box;
            box.physics.body = body;
            return body;
        });
    }

    createBall(ball) {
        let body = Bodies.circle(this.initialPoint.x, this.initialPoint.y, ball.ball.radius);
        body.density = 0.004;
        ball.physics.body = body;
        body.isBall = true;
        return body;
    }

    nextBall() {
        this.getCurrentBall().ball.active = false;
        let newBall = this.getBalls().find(ball => ball.ball.x < 100);
        if (newBall) {
            newBall.ball.active = true;
            World.add(this.engine.world, this.createBall(newBall));
            this.elastics.forEach(elastic => elastic.bodyB = newBall.physics.body);
        } else {
            // Player has run out of balls
            let fakeBall = Bodies.circle(this.initialPoint.x, this.initialPoint.y, 1);
            this.elastics.forEach(elastic => elastic.bodyB = fakeBall);
        }
    }

    checkPull() {
        let userInteraction = this.entities.queryComponents([UserInteraction])[0];
        if (userInteraction) {
            let x = Math.min(130, Math.max(0, userInteraction.userInteraction.x));
            let y = userInteraction.userInteraction.y;

            // Make sure the ball doesn't get stuck in the slingshot stand
            if (x > 108 && y > 407) {
                y = 407;
            }

            this.interactionConstraint.pointA.x = x;
            this.interactionConstraint.pointA.y = y;
            this.interactionConstraint.stiffness = 0.5;
        } else if (this.interactionConstraint.stiffness === 0.5) {
            this.interactionConstraint.pointA.x = this.initialPoint.x;
            this.interactionConstraint.pointA.y = this.initialPoint.y;
            this.interactionConstraint.stiffness = 0.005;
        }
    }

    listenToEvents() {
        Events.on(this.engine, "collisionStart", event => {
            event.pairs.forEach(pair => {
                if (pair.bodyA.isBall || pair.bodyB.isBall) {
                    //let ballBody = pair.bodyA.isBall ? pair.bodyA : pair.bodyB;
                    let otherBody = pair.bodyA.isBall ? pair.bodyB : pair.bodyA;
                    if (otherBody.isBox) {
                        if (pair.collision.depth > DEPTH_BOX_BREAK_THRESHOLD) {
                            this.breakBox(otherBody);
                        }
                    }
                }
            });
        });
    }

    breakBox(box) {
        // There seems to be a bug in matter.js that makes removing objects impossible.
        // Will wait until I've heard back from dev
        /*Composite.removeBody(this.engine.world, box, true);
        box.entity.box.explode = true;
        console.log(box.entity.box);*/
    }
}

class NoopRenderer {
    static create() {
        return new NoopRenderer();
    }

    world() {}
}
