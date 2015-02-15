'use strict';

angular.module('loo', [
  'ionic',
  'ngCordova',
  'angular-data.DSCacheFactory',
  'loo.controllers',
  'loo.services'
])

  .run(function ($ionicPlatform, $cordovaSplashscreen) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the
      // accessory bar above the keyboard for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (navigator.splashscreen) {
        $cordovaSplashscreen.hide();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('loo', {
        url: '/loo',
        templateUrl: 'templates/loo.tpl.html',
        controller: 'LooController'
      })
      .state('options', {
        url: '/options',
        templateUrl: 'templates/options.tpl.html',
        controller: 'OptionsController'
      });
    $urlRouterProvider.otherwise('/loo');
  });
