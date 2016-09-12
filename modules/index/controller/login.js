(function() {
    'use strict';

    angular
        .module('tk.index.login', ['tk.utils.api'])
        .controller('loginCtrl', Ctrl);

    Ctrl.$inject = ['$scope','$http','$state','tkApi'];

    function Ctrl($scope,$http,$state,tkApi) {
        $scope.user = {
            uid: '',
            pwd: ''
        }
        $scope.error = '';

        $scope.login = function () {
            $http.get(tkApi.user_login, {params: _.clone($scope.user)}).then(
                function (res) {
                    var result = res.data
                    if (result.success == false)
                        $scope.error = '用户名或密码错误'
                    else {
                        runtime.token = result.message
                        $state.go('index.home')
                    }
                },
                function () {
                    $scope.error = '登录时发生错误'
                }
            )
        }

        
    }


})();