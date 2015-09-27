import {Box} from "../components";

export default class BoxExploder {
    constructor(entities) {
        this.entities = entities;
    }

    tick() {
        this.entities.queryComponents([Box]).forEach(box => {
            if (box.box.explode) {
                console.log("boom", box);
                box.box.element.parentNode.removeChild(box.box.element);
                box.remove();
                return;
            }
        });
    }
}