var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');
 
gulp.task('build', function() {
  return gulp.src('./src/app.js')
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('build/'));
});
 
gulp.task('default', ['build']);