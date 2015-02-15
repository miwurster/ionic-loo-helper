'use strict';

angular.module('loo.services', []);

angular.module('loo.services').factory('MediaPlayer', function ($log, $cordovaMedia) {
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
          media.play();
        }
        return media;
      },
      stop: function () {
        media.stop();
      }
    };
  }
);

(function () {

  var DEFAULTS = {
    sound: {
      selected: 'water-tap',
      items: [
        {id: 0, name: 'water-tap'},
        {id: 1, name: 'shower'}
      ]
    }
  };

  function Options(data) {
    if (data && angular.isFunction(data.then)) {
      this.$unwrap(data);
      return;
    }
    this.$setData(data);
  }

  Options.$factory = function ($timeout) {
    angular.extend(Options, {
      $timeout: $timeout
    });
    return Options;
  };

  Options.prototype = {
    $setData: function (data) {
      angular.extend(this, data);
    },
    $unwrap: function (futureData) {
      var self = this;
      this.$futureData = futureData;
      this.$futureData.then(function (data) {
        Options.$timeout(function () {
          self.$setData(data);
        });
      });
    }
  };

  angular.module('loo.services').factory('Options', Options.$factory);

  angular.module('loo.services').factory('OptionsRepository', function (DSCacheFactory) {
    return {
      $$cache: DSCacheFactory('loo-helper', {
        storageMode: 'localStorage'
      }),
      get: function () {
        return new Options(this.$$cache.get('options') || DEFAULTS);
      },
      update: function (options) {
        this.$$cache.put('options', options);
      }
    };
  });

})();
