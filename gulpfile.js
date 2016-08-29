var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
var webpackConfigExamples = require('./webpack.config.examples.js');
var webpackConfigComponents = require('./webpack.config.components.js');

gulp.task('build', function() {
  return gulp.src('./src/app.js')
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('build/'));
});

gulp.task('examples', function() {
  return gulp.src('./examples/app.js')
      .pipe(webpack(webpackConfigExamples))
      .pipe(gulp.dest('./examples/build/'));
});

gulp.task('components', function() {
  return gulp.src('./examples/components/app.js')
      .pipe(webpack(webpackConfigComponents))
      .pipe(gulp.dest('./examples/components/build/'));
});

gulp.task('watch_components', ['components'], function () {
    gulp.watch('./examples/components/**/*.js', ['components']);
});

gulp.task('default', ['build']);
