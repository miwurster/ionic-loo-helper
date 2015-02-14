'use strict';

angular.module('loo', ['ionic', 'ngCordova', 'loo.controllers', 'loo.services', 'angular-data.DSCacheFactory'])

  .run(function ($ionicPlatform, $cordovaSplashscreen) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the
      // accessory bar above the keyboard for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      $cordovaSplashscreen.hide();
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      .state('tab.loo', {
        url: '/loo',
        views: {
          'tab-loo': {
            templateUrl: 'templates/tab-loo.html',
            controller: 'LooController'
          }
        }
      })

      .state('tab.settings', {
        url: '/settings',
        views: {
          'tab-settings': {
            templateUrl: 'templates/tab-settings.html',
            controller: 'SettingsController'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/loo');
  });
