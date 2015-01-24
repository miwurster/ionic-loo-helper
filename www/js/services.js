'use strict';

angular.module('loo.services', []);

angular.module('loo.services')

    .factory('$media', function ($cordovaMedia) {

        var media = {
            play: function () {
            },
            stop: function () {
            }
        };

        return {
            play: function (sound) {
                if (window.Media) {
                    media = $cordovaMedia.newMedia('/android_asset/www/media/' + sound + '.wav');
                }
                media.play();
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
                        display_name: 'A running water-tap',
                        file: '/android_asset/www/media/water-tap.wav'
                    },
                    {
                        id: 1,
                        name: 'shower',
                        display_name: 'A running shower',
                        file: '/android_asset/www/media/shower.wav'
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
