/* jshint camelcase: false */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var sh = require('shelljs');
var bower = require('bower');
var del = require('del');

var meta = require('./package.json');

var paths = {
  src: 'app',
  dist: 'www',
  tmp: '.tmp'
};

var files = {
  index: './app/index.html',
  sass: {
    main: './app/scss/app.scss',
    watch: ['./app/scss/**/*.scss']
  },
  scripts: ['./app/scripts/**/*.js', 'gulpfile.js'],
  templates: ['./app/templates/**/*.tpl.html'],
  static: {
    app: ['./app/images/**/*', './app/media/**/*'],
    bower: ['./bower_components/ionic/fonts/*']
  }
};

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('release', ['release:zip'], function () {
  return gulp.src(paths.dist + '/**/*')
    .pipe($.size({title: 'release', gzip: true}));
});

gulp.task('build', [
  'jshint',
  'sass',
  'usemin',
  'copy:templates',
  'copy:static:app',
  'copy:static:bower'
], function () {
  return gulp.src(paths.dist + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('clean', function (done) {
  del([paths.dist + '/', paths.tmp + '/'], done);
});

gulp.task('jshint', function () {
  return gulp.src(files.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('sass', function (done) {
  gulp.src(files.sass.main)
    .pipe($.sass())
    .pipe(gulp.dest(paths.tmp + '/css/'))
    .on('end', done);
});

gulp.task('usemin', ['sass'], function () {
  return gulp.src(files.index)
    .pipe($.usemin({
      css: [$.minifyCss({
        keepSpecialComments: 0
      })],
      html: [$.minifyHtml({empty: true})],
      js: [$.ngAnnotate({
        add: true,
        remove: true,
        single_quotes: true
      })]
    }))
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('release:uglify', function (done) {
  gulp.src(paths.dist + '/scripts/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest(paths.dist + '/scripts'))
    .on('end', done);
});

gulp.task('release:zip', ['release:uglify'], function () {
  return gulp.src(paths.dist + '/**/*')
    .pipe($.zip(meta.name + '.zip'))
    .pipe(gulp.dest(paths.tmp + '/'));
});

gulp.task('copy:templates', function () {
  return gulp.src(files.templates)
    .pipe($.minifyHtml({
      quotes: true
    }))
    .pipe($.angularTemplatecache({
      'filename': 'template-cache.js',
      'root': 'templates',
      'module': 'loo'
    }))
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:static:app', function () {
  return gulp.src(files.static.app, {base: 'app'})
    .pipe(gulp.dest(paths.dist + '/'));
});

gulp.task('copy:static:bower', function () {
  return gulp.src(files.static.bower, {base: 'bower_components'})
    .pipe(gulp.dest(paths.dist + '/bower_components'));
});

gulp.task('copy:sass', ['sass'], function () {
  return gulp.src(paths.tmp + '/css/app.css')
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('watch', function () {
  gulp.watch(files.sass.watch, ['sass', 'copy:sass']);
  gulp.watch(files.scripts, ['usemin']);
  gulp.watch(files.templates, ['copy:templates']);
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
