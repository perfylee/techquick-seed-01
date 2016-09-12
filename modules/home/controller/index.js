(function() {
    'use strict'

    angular
        .module('tk.home',['tk.utils.api'])
        .controller('homeCtrl', Ctrl)

    Ctrl.$inject = ['$scope','$http','tkApi']

    function Ctrl($scope,$http,tkApi) {
        $scope.menus = []
        $http.get(tkApi.menu_user).then(
            function (res) {
                $scope.menus = res.data.data
            },
            function () {

            }
        )
    }
})()