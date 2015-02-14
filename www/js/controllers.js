'use strict';

angular.module('loo.controllers', [])

  .controller('LooController', function ($scope, $ionicPlatform, $settings, $media) {

    $scope.active = false;

    $scope.play = function () {
      if (!$scope.active) {
        $media.play($settings.$find().data.sound.selected);
      } else {
        $media.stop();
      }
      $scope.active = !$scope.active;
    };

    $ionicPlatform.ready(function () {
      document.addEventListener("pause", function () {
        $media.stop();
        $scope.active = false;
        $scope.$apply();
      }, false);
    });
  })

  .controller('SettingsController', function ($scope, $settings) {

    var model = $settings.$find();

    function init() {
      $scope.settings = model.data;
    }

    $scope.onChangeSound = function (sound) {
      model.setData($scope.settings);
    };

    init();
  });
