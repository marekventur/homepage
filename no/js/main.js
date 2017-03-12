import $ from "jquery";
import enableSmoothScroll from "./smooth_scroll";

$(() => {
	$( window ).resize(onResize).scroll(onScroll);
	onResize();
	onScroll();
	enableSmoothScroll();
});

let viewportHeight, viewportWidth;

function onResize() {
	viewportHeight = $(window).innerHeight();
	viewportWidth = $(window).width();

	let introduction = $("#landing .introduction");
	let introductionHeight = introduction.outerHeight();

	let leftoverHeight = viewportHeight - introductionHeight;

	let top = 30;

	let min = Math.min(leftoverHeight, viewportWidth);

	let size = min - top * 2;

	size = Math.min(size, 350);

	$("#landing .circle").css({
		top: (min - size) / 2,
		fontSize: size / 100
	});

	$("#landing").css({
		height: viewportHeight
	});

}

function onScroll() {
	let scrollPos = $(document).scrollTop();
	let viewportHeight = $(window).height();

	let opacity = Math.max(0, Math.min(1, (scrollPos - viewportHeight / 2) / (viewportHeight / 2)));

	$("nav").css({ opacity });
}

