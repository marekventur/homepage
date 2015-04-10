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
        .pipe(source("main.js"))
        .pipe(gulp.dest("build/"))
        .pipe(connect.reload());
});

gulp.task("css", function() {
    return gulp.src("./css/main.styl")
        .pipe(stylus())
        .pipe(concat('main.css'))
        .pipe(gulp.dest("./build"))
        .pipe(connect.reload());
});

gulp.task("html", function () {
    gulp.src("index.html")
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

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/fonts',
      'mkdir dist/images',
      'mkdir dist/scripts',
      'mkdir dist/styles'
    ]
  );
});