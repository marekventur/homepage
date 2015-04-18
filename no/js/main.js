import $ from "./lib/jquery-2.1.3.min.js";

class Main {
    constructor(root) {
        this.root = root;
        this.boxes = this.root.find('.main-box, .main-headline, h1');
    }

    start() {
        let $container = $('.container');
        let containerOffset = $container.offset();

        this.boxes.each((index, box) => {
            let $box = $(box);
            let offset = $box.offset();
            box.originalOffset = offset;
            box.cssToBeApplied = {
                position: "relative",
                left: 0, /*offset.left - containerOffset.left,*/
                top: 0, /*offset.top - containerOffset.top,*/
                width: $box.width(),
                height: $box.height()
            };
        });

        this.boxes.each((index, box) => {
            let $box = $(box);
            $box.css(box.cssToBeApplied);
        });
    }

    stop() {
        this.boxes.each((index, box) => {
            let $box = $(box);
            $box.attr("style", "");
        });
    }

}

$(() => {
    //let main = new Main($('body'));
    //main.start();
});