'use strict';

var translations = {
  en: {
    APP_NAME: 'Loo Helper',
    OPTIONS: {
      TITLE: 'Options',
      AUDIO_TYPE: {
        TITLE: 'Audio Type',
        DESCRIPTION: 'You can choose which type of sound should be played.'
      }
    },
    'water-tap': 'A running water-tap',
    'shower': 'A running shower'
  },
  de: {
    APP_NAME: 'Töpfchen Helfer',
    OPTIONS: {
      TITLE: 'Optionen',
      AUDIO_TYPE: {
        TITLE: 'Audio Variante',
        DESCRIPTION: 'Wähle den Sound der abgespielt werden soll.'
      }
    },
    'water-tap': 'Ein laufender Wasserhahn',
    'shower': 'Eine laufende Dusche'
  }
};

angular.module('loo', [
  'ionic',
  'ngCordova',
  'angular-data.DSCacheFactory',
  'pascalprecht.translate',
  'loo.controllers',
  'loo.services'
])

  .run(function ($ionicPlatform, $cordovaSplashscreen) {
    $ionicPlatform.ready(function () {
      if (navigator.splashscreen) {
        $cordovaSplashscreen.hide();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {
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
    $translateProvider
      .translations('en', translations.en)
      .translations('de', translations.de)
      .registerAvailableLanguageKeys(['en', 'de'], {
        'en_US': 'en',
        'de_DE': 'de',
        'de_CH': 'de',
        'de_AT': 'de',
        'de_LI': 'de'
      })
      .fallbackLanguage('en')
      .determinePreferredLanguage();
  });
