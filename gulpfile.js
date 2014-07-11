var browserify = require('browserify');
var buffer = require('vinyl-buffer')
var connect = require('gulp-connect');
var envify = require('envify');
var gulp = require('gulp');
var rimraf = require('gulp-rimraf');
var source = require('vinyl-source-stream');

gulp.task('browserify', function () {
  return browserify('./lib')
    .ignore('compress')
    .bundle()
    .pipe(source('multislot.js'))
    .pipe(gulp.dest('.'));
});

gulp.task('clean', function () {
  return gulp.src(['node_modules', 'multislot.js', 'test/browser/build'], {read: false})
    .pipe(rimraf())
});

gulp.task('test-browser', ['test-browser-dep', 'test-browser-tests'], function () {
  connect.server({
    root: 'test/browser'
  });
});

gulp.task('test-browser-dep', function () {
  return gulp.src('node_modules/mocha/**')
    .pipe(gulp.dest('test/browser/build/mocha'))
});

gulp.task('test-browser-runner', function () {
  return browserify('./test')
    .ignore('compress')
    .transform('envify')
    .bundle()
    .pipe(source('index.js'))
    .pipe(gulp.dest('test/browser/build'));
});

gulp.task('default', ['browserify']);
