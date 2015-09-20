import World from "./world";

export default class Game {
    constructor(worldElement) {
        this.world = new World(worldElement);
        this.world.arrange();
    }
}