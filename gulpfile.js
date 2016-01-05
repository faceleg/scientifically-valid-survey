/* eslint strict:[2, "global"] */
'use strict';

var R = require('ramda');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;

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

    buildPaths = buildPaths.concat(R.map(function(bowerPath) {
      return bowerPath.replace(/bower_components/, 'public/build/bower-components');
    }, paths.scripts.bowerComponents));

    buildPaths = buildPaths.concat(R.map(function(appPath) {
      return appPath.replace(/public/, 'public/build/');
    }, paths.scripts.app));

    return buildPaths;
  },
  scripts: {
    bowerComponents: [
      'bower_components/ramda/dist/ramda.js',
      'bower_components/a0-angular-storage/dist/angular-storage.js',
      'bower_components/ng-table/dist/ng-table.js'
    ],
    app: [
      'public/app/templates.js',
      'public/app/app.js',
      'public/app/**/*.js',
      'public/components/home/home.js',
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
    require('postcss-nested')(),
    require('postcss-simple-vars')(),
    require('autoprefixer')(),
    require('postcss-responsive-type')(),
    require('lost')(),
  ]))
  .pipe(gulp.dest('public/build/css'));
});

gulp.task('javascript-bower-components', function() {
  return gulp.src(paths.scripts.bowerComponents, {
    base: './bower-components/'
  })
  .pipe(gulp.dest('public/build/bower-components/'));
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
  var server = require('gulp-express');
  var browserSync = require('browser-sync');
  browserSync({
    browser: 'google chrome'
  });
  var reload = browserSync.reload;
  server.run([
    'server/index.js'
  ]);

  gulp.watch('public/index-working.html', [
    'inject',
    // server.run,
    reload
  ]);

  gulp.watch(paths.templates, [
    'ngtemplates',
    // server.run,
    reload
  ]);

  gulp.watch(paths.css.all, [
    'css',
    'inject',
    // server.run,
    reload
  ]);

  // gulp.watch(paths.scripts.bowerComponents, [
  //   'javascript-bower-components',
  //   'inject',
  //   // server.run,
  //   reload
  // ]);

  gulp.watch(paths.scripts.app, [
    'javascript-app',
    'inject',
    // server.run,
    reload
  ]);

  // gulp.watch('server/**/*.js', [
    // server.run,
    // reload
  // ]);
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
    'javascript-bower-components',
    'ngtemplates',
    'javascript-app',
    'inject',
    callback);
});

var del = require('del');
gulp.task('build-clean', function () {
  return del.sync([
    'public/build/**/*',
    'public/index.html'
  ]);
});

gulp.task('default', [
  'build',
  'watch',
  // 'browser-sync'
]);

