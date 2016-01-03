import Scale from "./scale";
import getCanvasDebugDraw from "./box2d_debug_draw";
const b2 = Box2D;
const ZERO = new b2.b2Vec2(0, 0);

asfd)));

export default class Box2DPhysics {
    constructor() {
        this.world = new b2.b2World(
            new Box2D.b2Vec2(0, -10) // Gravity
        );

        this.scale = new Scale();

        this.addGround();
    }

    addGround() {
        const GROUND_HEIGHT = 2;

        let definition = new b2.b2BodyDef();
        definition.set_position(0, GROUND_HEIGHT * -0.5);

        this.ground = this.world.CreateBody(definition);

        let shape = new b2.b2PolygonShape();
        shape.SetAsBox(this.scale.pixelToWorld(2000), GROUND_HEIGHT);
        this.ground.CreateFixture(shape, 0);
    }

    addBox(box) {
        let x = this.scale.xPixelToWorld(box.x);
        let y = this.scale.yPixelToWorld(box.y);
        let width = this.scale.pixelToWorld(box.width);
        let height = this.scale.pixelToWorld(box.height);

        let definition = new b2.b2BodyDef();
        definition.set_type(b2.b2_dynamicBody); // Module.b2_dynamicBody
        definition.set_position(ZERO);

        let body = this.world.CreateBody(definition);

        let shape = new b2.b2PolygonShape();
        shape.SetAsBox(width, height);

        body.CreateFixture(shape, 1);
        body.SetTransform(new b2.b2Vec2(x, y), 0);
        body.SetLinearVelocity(ZERO);
        body.SetAwake(1);
        body.SetActive(1);

        box.getPosition = () => {
            return {
                x: body.
            };
        };
    }

    tick() {
        this.world.Step(1/60, 3, 2);
    }

    /**
     * Debug draw code
     **/

    setupDebugDraw(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext( '2d' );

        this.debugDraw = getCanvasDebugDraw();
        this.debugDraw.SetFlags(0x0001); // e_shapeBit
        this.world.SetDebugDraw(this.DebugDraw);
    }

    debugDraw() {
        context.fillStyle = 'rgb(0,0,0)';
        context.fillRect( 0, 0, canvas.width, canvas.height );

        context.save();
            context.translate(canvasOffset.x, canvasOffset.y);
            context.scale(1,-1);
            context.scale(this.scale.SCALE,this.scale.SCALE);
            context.lineWidth /= this.scale.SCALE;

            context.fillStyle = 'rgb(255,255,0)';
            this.world.DrawDebugData();

            /*if ( mouseJoint != null ) {
                //mouse joint is not drawn with regular joints in debug draw
                var p1 = mouseJoint.GetAnchorB();
                var p2 = mouseJoint.GetTarget();
                context.strokeStyle = 'rgb(204,204,204)';
                context.beginPath();
                context.moveTo(p1.get_x(),p1.get_y());
                context.lineTo(p2.get_x(),p2.get_y());
                context.stroke();
            }*/

        context.restore();
    }
}
