import $ from "jquery";

$(() => {
	$( window ).resize(onResize);
	onResize();
});

function onResize() {
	let nav = $("nav");
	let navHeight = nav.outerHeight() + 2 * parseInt(nav.css("top"), 10);
	let viewportHeight = $(window).height();
	let viewportWidth = $(window).width();

	let introduction = $("#landing .introduction");
	let introductionHeight = introduction.outerHeight();

	let leftoverHeight = viewportHeight - navHeight - introductionHeight;

	let top = 0;
	if (viewportWidth > 650) {
		top = 0;
	}

	let size = Math.min(leftoverHeight, viewportWidth) * 0.9 - top;

	$("#landing .circle").css({
		top,
		fontSize: size / 100
	});

	$("#landing").css({
		height: viewportHeight - navHeight
	});

}
