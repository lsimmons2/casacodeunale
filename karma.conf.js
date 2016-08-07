// Karma configuration
// Generated on Tue Aug 02 2016 23:41:17 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
	    './bower_components/jquery/dist/jquery.js',
	    './node_modules/angular/angular.js',            
	    './node_modules/angular-route/angular-route.js',
	    './node_modules/angular-mocks/angular-mocks.js',
	    './bower_components/angular-animate/angular-animate.js',
	    './bower_components/bootstrap/dist/js/bootstrap.js',
	    './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
	    './bower_components/angular-strap/dist/angular-strap.js',
	    './bower_components/angular-strap/dist/angular-strap.tpl.js',
	    './bower_components/ngScrollSpy/dist/ngScrollSpy.js',
	    './public/service.js',
	    './public/ctrls/boardCtrl.js',
	    './public/ctrls/navCtrl.js',
	    './public/ctrls/profCtrl.js',
	    './public/ctrls/signUpCtrl.js',
	    './public/app.js',	    
	    './test/service.spec.js',
	    './test/boardCtrl.spec.js',
	    './test/navCtrl.spec.js',
	    './test/profCtrl.spec.js',
	    './test/signUpCtrl.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
