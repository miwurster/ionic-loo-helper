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
var jshint = require('gulp-jshint');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');

var paths = {
  sass: ['./app/scss/**/*.scss'],
  scripts: ['./app/scripts/**/*.js'],
  templates: ['./app/templates/**/*.tpl.html'],
  static: ['./app/images/**/*', './app/media/**/*'],
  fonts: ['./bower_components/ionic/fonts/*']
};

gulp.task('default', ['jshint', 'sass', 'usemin', 'copy:templates', 'copy:static', 'copy:fonts']);
gulp.task('build', ['default']);
gulp.task('release', ['uglify:www']);

gulp.task('clean', function () {
  return del(['./www', './.tmp']);
});

gulp.task('jshint', function () {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('sass', function () {
  return gulp.src('./app/scss/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('./.tmp/css/'));
});

gulp.task('usemin', ['sass'], function () {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifyCss({
        keepSpecialComments: 0
      })],
      html: [minifyHtml({empty: true})],
      js: [ngAnnotate({
        add: true,
        remove: true,
        single_quotes: true
      })]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('uglify:www', function () {
  return gulp.src('./www/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./www/scripts'));
});

gulp.task('copy:templates', function () {
  return gulp.src(paths.templates)
    .pipe(minifyHtml({
      quotes: true
    }))
    .pipe(templateCache({
      'filename': 'template-cache.js',
      'root': 'templates',
      'module': 'loo'
    }))
    .pipe(gulp.dest('./www'));
});

gulp.task('copy:static', function () {
  return gulp.src(paths.static, {base: 'app'})
    .pipe(gulp.dest('./www'));
});

gulp.task('copy:fonts', function () {
  return gulp.src(paths.fonts, {base: 'bower_components'})
    .pipe(gulp.dest('./www/bower_components'));
});

gulp.task('copy:sass', ['sass'], function () {
  return gulp.src('.tmp/css/app.css')
    .pipe(gulp.dest('./www/css'));
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass', 'copy:sass']);
  gulp.watch(paths.scripts, ['usemin']);
  gulp.watch(paths.templates, ['copy:templates']);
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
