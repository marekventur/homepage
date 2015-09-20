/*eslint-disable no-undef */
// Polyfills
require("requestanimationframe");
/*eslint-enable */

import $ from "jquery";
import Slingshot from "./slingshot/slingshot";

class HomepageManager {
    constructor() {
        this.slingshot = new Slingshot(document.querySelector(".game-slingshot"));
    }

    start() {
        this.tick();
    }

    tick(time) {
        if (time) {
            this.slingshot.tick(time);
        }

        window.requestAnimationFrame(this.tick.bind(this));
    }
}

$(() => {
    new HomepageManager().start();
});
