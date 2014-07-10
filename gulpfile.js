var browserify = require('browserify');
var buffer = require('vinyl-buffer')
var envify = require('envify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('test', function () {
  return browserify('./test/index.js')
    .ignore('compress')
    .transform('envify')
    .bundle()
    .pipe(source('browser.js'))
    .pipe(gulp.dest('test'));
});
