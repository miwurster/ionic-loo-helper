'use strict';

angular.module('loo.services', []);

angular.module('loo.services')

  .factory('$media', function ($log, $cordovaMedia) {

    var media = {
      play: function () {
      },
      stop: function () {
      }
    };

    return {
      play: function (sound) {
        if (window.Media) {
          var filename = '/android_asset/www/media/' + sound + '.mp3';
          $log.debug('Going to play file: ' + filename);
          media = $cordovaMedia.newMedia(filename);
          media.then(
            function (success) {
            },
            function (error) {
              $log.error(JSON.stringify(error));
            }
          );
        }
        media.play();
        return media;
      },
      stop: function () {
        media.stop();
      }
    };
  }
);

(function () {

  function Settings(data) {
    if (data && angular.isFunction(data.then)) {
      this.$unwrap(data);
      return;
    }
    angular.extend(this, {data: data});
  }

  Settings.$factory = function ($timeout, DSCacheFactory) {
    angular.extend(Settings, {
      $timeout: $timeout
    });

    Settings.$cache = DSCacheFactory('cache', {
      storageMode: 'localStorage'
    });

    return Settings;
  };

  angular.module('loo.services').factory('$settings', Settings.$factory);

  Settings.prototype.$unwrap = function (futureData) {
    var self = this;
    this.$futureData = futureData;
    this.$futureData.then(function (data) {
      Settings.$timeout(function () {
        angular.extend(self, {data: data});
      });
    });
  };

  Settings.prototype.setData = function (data) {
    this.data = data;
    Settings.$save(data);
  };

  Settings.$find = function () {
    var DEFAULTS = {
      sound: {
        selected: 'water-tap',
        items: [
          {
            id: 0,
            name: 'water-tap',
            display_name: 'A running water-tap'
          },
          {
            id: 1,
            name: 'shower',
            display_name: 'A running shower'
          }
        ]
      }
    };
    return new Settings(Settings.$cache.get('settings') || DEFAULTS);
  };

  Settings.$save = function (data) {
    Settings.$cache.put('settings', data);
  }

})();
