"use strict";

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
  console.log("LOL");
});

gulp.task('build-css', function() {
  return gulp.src('styles/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('styles'));
});
