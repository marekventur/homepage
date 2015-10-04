export function Box() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.angle = 0;

    this.initiate = element => {
        this.element = element;
        let transform = element.getAttribute("transform").match(/translate\((\d+), (\d+)\) rotate\((\d+)\)/);
        this.x = parseInt(transform[1], 10);
        this.y = parseInt(transform[2], 10);
        this.angle = parseInt(transform[3], 10) / 180 * Math.PI;
        let rect = element.querySelector("rect");
        this.height = parseInt(rect.getAttribute("height"), 10) + 2;
        this.width = parseInt(rect.getAttribute("width"), 10) + 2;
    };
}

export function Ball() {
    this.x = 0;
    this.y = 0;
    this.radius = 0;

    this.initiate = element => {
        this.element = element;
        this.x = parseInt(element.getAttribute("cx"), 10);
        this.y = parseInt(element.getAttribute("cy"), 10);
        this.radius = parseInt(element.getAttribute("r"), 10);
    };
}

export function Enemy() {
    this.x = 0;
    this.y = 0;
    this.angle = 0;

    this.initiate = element => {
        this.element = element;
        let transform = element.getAttribute("transform").match(/translate\((\d+), (\d+)\) rotate\((\d+)\)/);
        this.x = parseInt(transform[1], 10);
        this.y = parseInt(transform[2], 10);
        this.angle = parseInt(transform[3], 10) / 180 * Math.PI;
        this.body = element.querySelector(".body");
    };
}

export function Physics() {
    this.body = null;
}

export function UserInteraction() {
    this.pressed = null;
    this.x = null;
    this.y = null;
}
