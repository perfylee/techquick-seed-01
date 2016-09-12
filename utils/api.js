(function() {
    'use strict'
    angular
        .module('tk.utils.api', ['tk.config'])
        .factory('tkApi', Factory)

    Factory.$inject = ['_modeConfig','_apiConfig']
    function Factory(modeConfig, _apiConfig) {

        return _.chain(_apiConfig[modeConfig.mode].api)
            .mapObject(function (val, key) {
                return _apiConfig[modeConfig.mode].apiBase + val
            }).value()

    }
})()