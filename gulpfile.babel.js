import fs from 'fs'
import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import babelConfig from './src/config/node.side.babel.options'

const $ = gulpLoadPlugins();

gulp.task('build', ['pullHTML', 'makeStaticDir'], () => {
  gulp.src(['./src/**/*.js', './src/**/*.jsx'])
    .pipe($.babel(babelConfig))
    .pipe(gulp.dest('./build'))
});
gulp.task('pullHTML', () => {
  return gulp.src('./src/views/**/*.html').pipe(gulp.dest('./build/views'));
});
gulp.task('makeStaticDir', () => {
  return gulp.src('./src/static/dist/placehold').pipe(gulp.dest('./build/static/dist'));
});
