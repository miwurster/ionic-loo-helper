'use strict';

angular.module('loo.controllers', [])

  .controller('LooController', function ($scope, $ionicPlatform, OptionsRepository, MediaPlayer) {
    $scope.active = false;
    $scope.play = function () {
      if (!$scope.active) {
        MediaPlayer.play(OptionsRepository.get().sound.selected);
      } else {
        MediaPlayer.stop();
      }
      $scope.active = !$scope.active;
    };
    $ionicPlatform.ready(function () {
      document.addEventListener('pause', function () {
        MediaPlayer.stop();
        $scope.active = false;
        $scope.$apply();
      }, false);
    });
  })

  .controller('OptionsController', function ($scope, OptionsRepository) {
    $scope.options = OptionsRepository.get();
    $scope.onChangeSound = function (/* sound */) {
      OptionsRepository.update($scope.options);
    };

  });
