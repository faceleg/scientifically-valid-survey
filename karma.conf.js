'use strict';
module.exports = function(config) {

  config.set({
    basePath: '',
    files: [
      'bower_components/rxjs/dist/rx.all.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/ngDialog/js/ngDialog.js',
      'bower_components/a0-angular-storage/dist/angular-storage.js',
      'bower_components/rx-angular/dist/rx.angular.js',
      'bower_components/ng-table/dist/ng-table.js',
      'public/app/templates.js',
      'public/app/app.js',
      'public/app/**/*.js',
      'public/components/login-dialog/login-dialog.js',
      'public/components/question/question.js',
      'public/components/choice/choice.js',
      'public/components/answer/answer.js',
      'public/components/home/home.js',
      'public/components/admin-questions/admin-questions.js',
      'public/components/**/*.js',
      'test/angular/**/*.js'
    ],
    browsers: ['PhantomJS'],
    frameworks: [
      'jasmine'
    ],
    reporters: ['progress', 'coverage', 'notify'],
    preprocessors: {
      'public/app/**/!(*templates).js': ['coverage'],
      'public/components/**/*.js': ['coverage']
    },
    plugins: [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-notify-reporter'
    ],
    notifyReporter: {
      reportEachFailure: true,
      reportSuccess: false
    },
    coverageReporter: {
      reporters: [{
        type: 'html',
        subdir: 'report-html'
      },
      {
        type: 'text-summary',
        subdir: 'report-summary',
        file: 'text-summary.txt'
      },
      {
        type: 'lcov',
        subdir: 'report-lcov'
      }
      ]
    }
  });
};


