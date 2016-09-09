'use strict'

angular.module('tk',[
    'ui.router',
    'tk.global',
    'tk.system.user',
    'tk.system.role'
])

.config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {


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

.controller('mainCtrl',['$scope','$rootScope','$state','tkGlobal',function ($scope,$rootScope,$state,tkGlobal) {

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


    $scope.menus = []
    $scope.currentOpen = null

    $scope.openSubMenu = function (menu) {
        if (angular.isArray(menu.children) && menu.children.length > 0 && menu.parentId != null) {
            if ($scope.currentOpen && $scope.currentOpen.id == menu.id)
                $scope.currentOpen = null
            else
                $scope.currentOpen = menu
        }

    }

    //"15f9a987-73db-11e6-b1cd-74867a69dbf7"
    tkGlobal.resource.read(
        tkGlobal.api.menu_query+'/:id',
        {
            id: '15f9a987-73db-11e6-b1cd-74867a69dbf7'
        },
        function (res) {
            console.log(res)
            $scope.menus = []
            angular.forEach(res.data, function (menu0) {
                if (menu0.parentId == null) {
                    menu0.children = []
                    angular.forEach(res.data, function (menu1) {
                        if (menu0.id == menu1.parentId) {
                            menu1.children = []
                            angular.forEach(res.data, function (menu2) {
                                if (menu1.id == menu2.parentId)
                                    menu1.children.push(menu2)
                            })
                            menu0.children.push(menu1)
                        }
                    })
                    $scope.menus.push(menu0)
                }
            })

            console.log($scope.menus)
        },
        function () {

        }
    )

}])