/*eslint-disable no-undef */
// Polyfills
require("requestanimationframe");
/*eslint-enable */

import $ from "jquery";
import SlingshotGame from "./slingshot/slingshot_game";

class HomepageManager {
    constructor() {
        this.slingshot = new SlingshotGame(document.querySelector(".game-slingshot"));
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
