import Scale from "./scale";
import _ from "underscore";

const b2 = Box2D; // eslint-disable-line no-undef
const ZERO = new b2.b2Vec2(0, 0);
const SLINGSHOT_REST_POSITION = {x: 133, y: 377}
const SLINGSHOT_MAX_ACTIVATE_DISTANCE = 20; // Pixels
const SLINGSHOT_DRAG_ORIGIN = {x: 133, y: 367}; // Pixels
const SLINGSHOT_MAX_DRAG_DISTANCE = 100; // Pixels
const SLINGSHOT_MIN_DRAG_DISTANCE = 20; // Pixels
const SLINGSHOT_FIRE_SPEED_FACTOR = 10;

export default class Box2DPhysics {
    constructor(balls) {
        this.world = new b2.b2World(
            new b2.b2Vec2(0, -10) // Gravity
        );

        this.scale = new Scale();

        this.addGround();

        this.afterCalculationFunctions = [];

        this.balls = balls;
        this.unusedBalls = _.clone(balls);
    }

    _pixelToVector({x, y}) {
        return new b2.b2Vec2(this.scale.xPixelToWorld(x), this.scale.yPixelToWorld(y));
    }

    addGround() {
        let definition = new b2.b2BodyDef();
        definition.set_position(ZERO);

        this.ground = this.world.CreateBody(definition);

        let shape = new b2.b2PolygonShape();
        shape.SetAsBox(this.scale.pixelToWorld(2000), 0.5);
        this.ground.CreateFixture(shape, 0);
        this.ground.SetTransform(new b2.b2Vec2(0, -0.5), 0);
    }

    addBox(box) {
        let width = this.scale.pixelToWorld(box.width);
        let height = this.scale.pixelToWorld(box.height);

        let definition = new b2.b2BodyDef();
        definition.set_type(b2.b2_dynamicBody);
        definition.set_position(ZERO);

        let body = this.world.CreateBody(definition);

        let shape = new b2.b2PolygonShape();
        shape.SetAsBox(width / 2, height / 2);

        body.CreateFixture(shape, 1);
        body.SetTransform(this._pixelToVector(box), box.angle);
        body.SetLinearVelocity(ZERO);
        body.SetAwake(1);
        body.SetActive(1);

        box.body = body;

        this.afterCalculationFunctions.push(() => {
            box.x = this.scale.xWorldToPixel(body.GetPosition().get_x());
            box.y = this.scale.yWorldToPixel(body.GetPosition().get_y());
            box.angle = body.GetAngle();
        });
    }



    get nextBall() {
        return this.unusedBalls[0] || null;
    }

    tick() {
        this.world.Step(1/60, 3, 2);
        this.afterCalculationFunctions.forEach(func => func());
    }

    letBallFly(ball) {
        let definition = new b2.b2BodyDef();
        definition.set_type(b2.b2_dynamicBody);
        definition.set_position(this._pixelToVector(ball));

        let body = this.world.CreateBody(definition);

        let shape = new b2.b2CircleShape();
        shape.set_m_radius(this.scale.pixelToWorld(ball.radius));

        // Calculate velocity according to http://gamedev.stackexchange.com/a/25893
        let velocity = {
            x: -(ball.x - SLINGSHOT_DRAG_ORIGIN.x) * SLINGSHOT_FIRE_SPEED_FACTOR,
            y:  (ball.y - SLINGSHOT_DRAG_ORIGIN.y) * SLINGSHOT_FIRE_SPEED_FACTOR
        };

        body.CreateFixture(shape, 3);
        body.SetLinearVelocity(new b2.b2Vec2(this.scale.pixelToWorld(velocity.x), this.scale.pixelToWorld(velocity.y)));
        body.SetAwake(1);
        body.SetActive(1);

        this.afterCalculationFunctions.push(() => {
            ball.x = this.scale.xWorldToPixel(body.GetPosition().get_x());
            ball.y = this.scale.yWorldToPixel(body.GetPosition().get_y());
        });
    }

    /**
     * Mouse interaction
     **/

    mouseMove(x, y) {
        let dx = x - SLINGSHOT_REST_POSITION.x;
        let dy = y - SLINGSHOT_REST_POSITION.y;
        let d = Math.sqrt(dx * dx + dy * dy);

        // Don't allow ball to be dragged too far
        if (d > SLINGSHOT_MAX_DRAG_DISTANCE) {
            let f = SLINGSHOT_MAX_DRAG_DISTANCE / d;
            dx *= f;
            dy *= f;
        }

        if (this._mouseIsDown) {
            this.nextBall.x = SLINGSHOT_REST_POSITION.x + dx;
            // Don't allow ball to be dragged underground
            this.nextBall.y = Math.min(SLINGSHOT_REST_POSITION.y + dy, this.scale.GROUND_PIXEL_POSITION - this.nextBall.radius);
        }
    }

    mouseDown(x, y) {
        let dx = x - SLINGSHOT_REST_POSITION.x;
        let dy = y - SLINGSHOT_REST_POSITION.y;
        let distanceToBall = Math.sqrt(dx * dx + dy * dy);
        if (this.nextBall && distanceToBall <= SLINGSHOT_MAX_ACTIVATE_DISTANCE && !this._mouseIsDown) {
            this._mouseIsDown = true;
            this.mouseMove(x, y);
        }
    }

    mouseUp() {
        console.log("up");
        let dx = this.nextBall.x - SLINGSHOT_DRAG_ORIGIN.x;
        let dy = this.nextBall.y - SLINGSHOT_DRAG_ORIGIN.y;
        let distanceToBall = Math.sqrt(dx * dx + dy * dy);
        if (this._mouseIsDown) {
            this._mouseIsDown = false;
            if (distanceToBall < SLINGSHOT_MIN_DRAG_DISTANCE) {
                // Not dragged enough. Move back.
                this.nextBall.x = SLINGSHOT_REST_POSITION.x;
                this.nextBall.y = SLINGSHOT_REST_POSITION.y;
            } else {
                // Fly!
                this.letBallFly(this.unusedBalls.shift());
                setTimeout(() => {
                    this.nextBall.x = SLINGSHOT_REST_POSITION.x
                    this.nextBall.y = SLINGSHOT_REST_POSITION.y
                }, 300);
            }
        }
    }
}
