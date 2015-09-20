/*eslint-env node */
"use strict";

var gulp = require("gulp");
var server = require("gulp-develop-server");
var stylus = require("gulp-stylus");
var concat = require('gulp-concat');
var fileinclude = require("gulp-file-include");
var browserify = require('browserify');
var babelify = require("babelify");
var watchify = require("watchify");
var browserSync = require('browser-sync').create();
var source = require("vinyl-source-stream");
var nib = require("nib");
var gutil = require("gulp-util");
var notify = require("gulp-notify");
var htmlhint = require("gulp-htmlhint");

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });
});

function bundleMainBrowserify(b) {
    return b.bundle()
        .on("error", function(err){
            console.log(err.message);
        })
        .pipe(source("main.js"))
        .pipe(gulp.dest("./build/"));
}

function createMainBrowserify() {
    return browserify({
        entries: "./js/main.js",
        transform: [babelify],
        cache: {},        // for watchify
        packageCache: {}, // for watchify
        debug: true
    });
}

gulp.task("js", function() {
    bundleMainBrowserify(createMainBrowserify());
});

gulp.task("js:watch", function() {
    var b = watchify(createMainBrowserify());
    b.on("log", gutil.log);
    bundleMainBrowserify(b); // run build when watch is started
    b.on("update", function() {
        bundleMainBrowserify(b)
        .pipe(browserSync.stream());
    });
});

gulp.task("css", function() {
    return gulp.src("./css/index.styl")
        .pipe(stylus({ use: [nib()] }))
        .on('error', notify.onError(function(err) {
            var errorName = err.name;
            var errorMessage = err.message;
            var lines = err.message.split("\n");
            var shorterErrorMessage = [lines[5], lines[11]].join("\n")
            console.log("[Stylus] " + errorName + "\n" + errorMessage);
            return "[Stylus] " + errorName + "\n" + shorterErrorMessage;
        }))
        .pipe(gulp.dest("./build"))
        .pipe(browserSync.stream());
});

gulp.task("html", function () {
    gulp.src("index.html")
    .pipe(fileinclude({
        prefix: "@@",
        basepath: "@file"
    }))
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter())
    .on('error', notify.onError(function(err) {
        return err.message;
    }))
    .pipe(gulp.dest("build/"))
    .pipe(browserSync.stream());
});

gulp.task("img", function () {
    gulp.src(["img/*.png", "img/*.svg"])
    .pipe(gulp.dest("build/img/"))
    .pipe(browserSync.stream());
});

gulp.task("build", [ "js", "css", "html", "img"]);

gulp.task("watch", ["build", "js:watch"], function () {
    gulp.watch(["index.html", "game/**"], ["html"]);
    gulp.watch("img/**", ["img"]);
    gulp.watch("css/*.styl", ["css"]);
});

gulp.task("default", ["build", "server", "watch"]);
