(function() {
    'use strict'
    angular
        .module('tk.utils.runtime', ['ngCookies'])
        .factory('tkRuntime', Factory)

    Factory.$inject = ['$cookies']
    function Factory($cookies) {

        return {
            getToken:function () {
                return $cookies.get('TK-TOKEN')
            }
        }
    }
})()