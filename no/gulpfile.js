/*eslint-env node */
"use strict";

var gulp = require("gulp");
var server = require("gulp-develop-server");
var stylus = require("gulp-stylus");
var concat = require('gulp-concat');
var browserify = require('browserify');
var babelify = require("babelify");
var connect = require('gulp-connect');
var source = require("vinyl-source-stream");
var nib = require("nib");
var notify = require("gulp-notify");
var htmlhint = require("gulp-htmlhint");

gulp.task('server', function() {
    connect.server({
        root: __dirname + '/build',
        livereload: true
    });
});

gulp.task("js", function() {
    return browserify({
                entries: "./js/main.js",
                debug: true,
                transform: [babelify]
            })
        .bundle()
        .on('error', notify.onError(function(err) {
            return "[JS] " + err.message;
        }))
        .pipe(source('main.js'))
        .pipe(gulp.dest("build/"))
        .pipe(connect.reload());
});

gulp.task("css", function() {
    return gulp.src("./css/main.styl")
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
        .pipe(connect.reload());
});

gulp.task("html", function () {
    gulp.src("index.html")
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter())
    .on('error', notify.onError(function(err) {
        return err.message;
    }))
    .pipe(gulp.dest("build/"))
    .pipe(connect.reload());
});

gulp.task("img", function () {
    gulp.src("img/*.png")
    .pipe(gulp.dest("build/img/"))
    .pipe(connect.reload());
});

gulp.task("build", ["js", "css", "html", "img"]);

gulp.task("watch", ["build"], function () {
    gulp.watch("index.html", ["html"]);
    gulp.watch("img/**", ["img"]);
    gulp.watch("js/*.js", ["js"]);
    gulp.watch("css/*.styl", ["css"]);
});

gulp.task("default", ["build", "server", "watch"]);
