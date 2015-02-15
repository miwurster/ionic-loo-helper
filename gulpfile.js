var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var bower = require('bower');
var sh = require('shelljs');

var paths = {
  sass: ['./app/scss/**/*.scss']
};

gulp.task('default', ['sass', 'usemin', 'copy', 'copy:fonts']);

gulp.task('sass', function (done) {
  gulp.src('./app/scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./.tmp/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./.tmp/css/'))
    .on('end', done);
});

gulp.task('usemin', ['sass'], function () {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [/* minifyCss(), */'concat'],
      html: [/* minifyHtml({empty: true}) */],
      js: [/* uglify() */]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('copy', function () {
  gulp.src([
    './app/templates/**/*',
    './app/images/**/*',
    './app/media/**/*'
  ], {base: 'app'})
    .pipe(gulp.dest('./www'));
});

gulp.task('copy:fonts', function () {
  gulp.src(['./bower_components/ionic/fonts/*'], {base: 'bower_components'})
    .pipe(gulp.dest('./www/bower_components'));
});

gulp.task('clean', function (callback) {
  del(['./www/**/*', '!.www/.gitignore'], callback);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
