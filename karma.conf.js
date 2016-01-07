'use strict';
module.exports = function(config) {

  config.set({
    basePath: '',
    files: [
      'bower-components/angular/angular.js',
      'bower-components/angular-aria/angular-aria.js',
      'bower-components/angular-messages/angular-messages.js',
      'bower-components/angular-resource/angular-resource.js',
      'bower-components/angular-animate/angular-animate.js',
      'bower-components/angular-mocks/angular-mocks.js',
      'bower-components/angular-ui-router/release/angular-ui-router.js',
      'bower-components/ng-dialog/js/ngDialog.js',
      'bower-components/ng-table/dist/ng-table.js',
      'public/app/templates.js',
      'public/app/app.js',
      'public/app/**/*.js',
      'public/components/question/question.js',
      'public/components/choice/choice.js',
      'public/components/answer/answer.js',
      'public/components/home/home.js',
      'public/components/admin-questions/admin-questions.js',
      'public/components/**/*.js',
      'test/angular/unit/**/*.js'
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
      'karma-junit-reporter',
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
      }, {
        type: 'lcov',
        subdir: 'report-lcov'
      },
      {
        type: 'text-summary',
        subdir: 'report-summary',
        file: 'text-summary.txt'
      }]
    }
  });
};


