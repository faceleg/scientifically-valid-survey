/* eslint strict:[2, "global"] */
'use strict';

var R = require('ramda');
var gulp = require('gulp');

var runSequence = require('run-sequence');
var rename = require('gulp-rename');

var ngAnnotate = require('gulp-ng-annotate');

var inject = require('gulp-inject');

var postcss = require('gulp-postcss');

var paths = {
  build: function() {
    var buildPaths = [
      'public/build/css/core.css'
    ];

    return buildPaths.concat(R.map(function(appPath) {
      return appPath.replace(/public/, 'public/build/');
    }, paths.scripts.app));
  },
  scripts: {
    app: [
      'public/app/templates.js',
      'public/app/app.js',
      'public/app/**/*.js',
      'public/components/question/question.js',
      'public/components/choice/choice.js',
      'public/components/answer/answer.js',
      'public/components/home/home.js',
      'public/components/admin-questions/admin-questions.js',
      'public/components/**/*.js'
    ]
  },

  css: {
    core: [
      'css/core.css'
    ],
    all: [
      'css/**/*.css',
      'public/components/**/*.css'
    ]
  },

  templates: [
    'public/app/**/*.html',
    'public/components/**/*.html'
  ]
};

gulp.task('css', function() {
  return gulp.src('css/core.css')
  .pipe(postcss([
    require('postcss-import')({
      path: __dirname + '/css/'
    }),
    require('postcss-extend')(),
    require('postcss-nested')(),
    require('postcss-simple-vars')(),
    require('autoprefixer')(),
    require('postcss-responsive-type')(),
    require('postcss-color-function')(),
    require('lost')(),
  ]))
  .pipe(gulp.dest('public/build/css'));
});

gulp.task('javascript-app', function() {
  return gulp.src(paths.scripts.app, {
    base: './public/'
  })
  .pipe(ngAnnotate())
  .pipe(gulp.dest('public/build/'))
  .on('error', function() {
    console.log(arguments); // eslint-disable-line no-console, angular/log
  });
});

gulp.task('inject', function() {
  return gulp.src('public/index-working.html')
  .pipe(inject(gulp.src(paths.build(), {
    read: false,
    relative: true
  }), {
    transform: function injectTransform(filepath) {
      return inject.transform.apply(inject.transform, [
        filepath.replace(/\/public/, '') + '?' + +new Date()
      ]);
    }
  }))
  .pipe(rename('public/index.html'))
  .pipe(gulp.dest('.'));
});

var templateCache = require('gulp-angular-templatecache');
gulp.task('ngtemplates', function() {
  return gulp.src([
    'public/app/**/*.html',
    'public/components/**/*.html'
  ])
  .pipe(templateCache({
    standalone: true,
    module: 'svs.templates'
  }))
  .pipe(gulp.dest('public/app/'));
});

gulp.task('watch', function() {
  var gls = require('gulp-live-server');
  var server = gls.new('server/index.js');
  server.start();

  gulp.watch([
    'public/build/**/*.css',
    'public/build/**/*.js'
  ], function (file) {
    server.notify.apply(server, [file]);
  });

  gulp.watch('server/**/*.js', function() {
    server.start.bind(server)();
  });

  gulp.watch('public/index-working.html', [
    'inject',
    function(file) {
      server.notify.apply(server, [file]);
    }
  ]);

  gulp.watch(paths.templates, [
    'ngtemplates',
    function(file) {
      server.notify.apply(server, [file]);
    }
  ]);

  gulp.watch(paths.css.all, [
    'css',
    'inject',
    function(file) {
      server.notify.apply(server, [file]);
    }
  ]);

  gulp.watch(paths.scripts.app, [
    'javascript-app',
    'inject',
    function(file) {
      server.notify.apply(server, [file]);
    }
  ]);
});

var lintspaces = require('gulp-lintspaces');
gulp.task('lint-css', function() {
  return gulp.src(paths.css.all.concat(['public/**/*.html']))
  .pipe(lintspaces({
    newlineMaximum: 2,
    trailingspaces: true,
    indentation: 'spaces',
    spaces: 2
  }))
  .pipe(lintspaces.reporter());
});

gulp.task('build', function(callback) {
  runSequence(
    'build-clean',
    'css',
    'ngtemplates',
    'javascript-app',
    'inject',
    callback);
});

var del = require('del');
gulp.task('build-clean', function () {
  return del.sync([
    'public/build/js/**/*',
    'public/index.html'
  ]);
});

gulp.task('default', function() {
  runSequence('build', 'watch')
});

