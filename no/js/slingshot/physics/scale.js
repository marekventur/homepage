export default class Scale {
    constructor() {
        this.SCALE = 50; // 50 Pixels = 1 m
        this.GROUND_PIXEL_POSITION = 470;
    }

    pixelToWorld(input) {
        return input / this.SCALE;
    }

    worldToPixel(input) {
        return input * this.SCALE;
    }

    xPixelToWorld(input) {
        return this.pixelToWorld(input);
    }

    xWorldToPixel(input) {
        return this.worldToPixel(input);
    }

    yPixelToWorld(input) {
        return this.pixelToWorld(this.GROUND_PIXEL_POSITION - input);
    }

    yWorldToPixel(input) {
        return this.GROUND_PIXEL_POSITION - this.worldToPixel(input);
    }
}
