'use strict'

var tk = {
    token: '12345678'
}


angular.module('tk',[
    'ui.router',
    'tk.config',
    'tk.utils.crypto',
    'tk.global',
    'tk.system.user',
    'tk.system.role'
])

.factory('HttpInterceptor',['tkCrypto','_appConfig',function (tkCrypto,appConfig) {
    return {
        request: function (config) {
            config.headers[appConfig.header.signature] = tkCrypto.sign()
            config.headers[appConfig.header.token] = tk.token

            config.params._r = Math.random()

            if (!_.isNull(config.params)) {
                _.chain(config.url.replace('://', '').replace(/\?/g, /\//).split('/'))
                    .filter(function (val) {
                        return val.indexOf(':') == 0
                    })
                    .each(function (val) {
                        val = val.replace(':', '')
                        if (_.has(config.params, val)) {
                            config.url = config.url.replace(new RegExp(':' + val, 'g'), tkCrypto.encrypt(config.params[val]))
                            config.params = _.omit(config.params, val)
                        } else {
                            config.url = config.url.replace(new RegExp(':' + val, 'g'), tkCrypto.encrypt(''))
                        }
                    })
            }

            if (!_.isNull(config.data)) {
                config.data = tkCrypto.encrypt(JSON.stringify(config.data))
            }
            return config
        },
        response: function (config) {
            if (!_.has(config.headers(), appConfig.header.unEncrypt.toLowerCase())) {
                config.data = JSON.parse(tkCrypto.decrypt(config.data))
            }
            return config
        }

    }
}])

.config(['$httpProvider','$stateProvider','$urlRouterProvider',function ($httpProvider,$stateProvider,$urlRouterProvider) {

    $httpProvider.interceptors.push('HttpInterceptor')

    $urlRouterProvider.otherwise('/home')

    $stateProvider
        .state('home', {
            url: '/home',
            template: '<div>index</div>',
            controller: function () {
            }
        })
        .state('system', {
            abstract: true,
            template: '<div ui-view></div>'
        })
        .state('system.user', {
            url: '/system/user',
            templateUrl: 'modules/system/view/user.html',
            controller: 'systemUserCtrl'
        })
        .state('system.role', {
            url: '/system/role',
            templateUrl: 'modules/system/view/role.html',
            controller: 'systemRoleCtrl'
        })
        .state('404', {
            url: '/404',
            template: '访问的页面不存在'
        })
        .state('403', {
            url: '/403',
            template: '没有权限'
        })


}])

.controller('mainCtrl',['$scope','$rootScope','$state','$http',function ($scope,$rootScope,$state,$http) {

    $scope.$on('$stateNotFound',
        function (event, unfoundState, fromState, fromParams) {
            event.preventDefault()
            //console.log(unfoundState)
            $state.go('404')
        }
    )

    $scope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
            //console.log(fromState)
            //console.log(fromParams)
            // if(toState.name == 'system.user') {
            //     event.preventDefault()
            //     $state.go('403', {test: 1})
            // }

        }
    )

    $http.get(
        '/api/menu/:id',
        {
            params: {
                id: '15f74fbe-73db-11e6-b1cd-74867a69dbf7'
            }
        }
    ).success(function (res) {
        console.log(res)
    })

}])