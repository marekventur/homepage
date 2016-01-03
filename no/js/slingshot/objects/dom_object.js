export default class DomObject {
    constructor(element, attributes) {
        this.element = element;
        this.attributes = attributes;

        // This is a cache of the current values. #updateDome will only call update if a change has happened
        this.lastValues = {};
    }

    updateDom() {
        this.attributes.forEach(attribute => {
            let value = this[`calculate${attribute}`]();
            if (value !== this.lastValues[attribute]) {
                this.lastValues[attribute] = value;

                this.element.setAttribute(attribute.toLowerCase(), value);
            }
        });
    }

    roundPosition(input) {
        return Math.round(input * 10) / 10;
    }

    roundAngle(input) {
        return Math.round(input * 10) / 10;
    }
}