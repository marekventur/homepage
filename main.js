(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/runner/work/homepage/homepage/js/main.js":[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _smooth_scroll = require("./smooth_scroll");

var _smooth_scroll2 = _interopRequireDefault(_smooth_scroll);

$(function () {
	$(window).resize(onResize).scroll(onScroll);
	onResize();
	onScroll();

	$("#work li").each(function (i, element) {
		element = $(element);
		element.find(".trigger").click(function (event) {
			event.stopPropagation();
			element.toggleClass("detailed").removeClass("faded");

			var open = element.hasClass("detailed");

			$("#work li").not(element).each(function (i, element) {
				$(element).removeClass("detailed");

				if (open) {
					$(element).addClass("faded");
				} else {
					$(element).removeClass("faded");
				}
			});

			onResize();
		});
	});

	(0, _smooth_scroll2["default"])();
});

var viewportHeight = undefined,
    viewportWidth = undefined;

function onResize() {
	viewportHeight = $(window).innerHeight();
	viewportWidth = $(window).width();

	var introduction = $("#landing .introduction");
	var introductionHeight = introduction.outerHeight();

	var leftoverHeight = viewportHeight - introductionHeight;

	var top = 30;

	var min = Math.min(leftoverHeight, viewportWidth);

	var size = min - top * 2;

	size = Math.min(size, 300);

	$("#landing .circle").css({
		top: (leftoverHeight - size) / 2,
		fontSize: size / 100
	});

	$("#landing").css({
		height: viewportHeight
	});

	// Desciption
	$("#work li.detailed .info").each(function (i, element) {
		element = $(element);
		var offset = element.offset();
		console.log(offset, element.css("margin-left"));
		element.css({
			marginLeft: parseInt(element.css("margin-left"), 10) - offset.left - 1,
			width: viewportWidth + 1
		});
	});
}

function onScroll() {
	var scrollPos = $(document).scrollTop();
	var viewportHeight = $(window).height();

	var opacity = Math.max(0, Math.min(1, (scrollPos - viewportHeight / 2) / (viewportHeight / 2)));

	$("nav").css({ opacity: opacity });
}

},{"./smooth_scroll":"/home/runner/work/homepage/homepage/js/smooth_scroll.js"}],"/home/runner/work/homepage/homepage/js/smooth_scroll.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

exports['default'] = function () {
    $('a[href*="#"]:not([href="#"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 500);
                return false;
            }
        }
    });
};

;
module.exports = exports['default'];

},{}]},{},["/home/runner/work/homepage/homepage/js/main.js"]);
