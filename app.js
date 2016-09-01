'use strict'

angular.module('tk',[
    'ui.router',
])

.config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('index', {
        url: '/index',
        template: '<div>123</div>',
        controller: function () {}
    }).state('system', {
        url: '/system',
        template: '<div>456</div>',
        controller: function () {}
    })
}])

.controller('indexCtrl',['$scope',function ($scope) {

    $scope.menus = [
        {
            id:'000',
            name: '全网概览',
            state: 'index',
            icon: 'home'
        },
        {
            id:'300',
            name: '资源管理',
            state: null,
            icon: 'power off',
            children: [
                {
                    id:'310',
                    name: '设备管理',
                    state: 'resource.dev',
                    icon: 'hdd'
                },
                {
                    id:'320',
                    name: '用户管理',
                    state: 'resource.user',
                    icon: 'hdd'
                }
            ]
        },
        {
            id:'100',
            name: '统计分析',
            state: null,
            icon: 'power off',
            children: [
                {
                    id:'110',
                    name: '资源统计',
                    icon: 'hdd',
                    children: [
                        {
                            id:'111',
                            name: '设备资源',
                            state: 'resource.dev',
                            icon: 'hdd'
                        },
                        {
                            id:'112',
                            name: '用户资源',
                            state: 'resource.dev',
                            icon: 'hdd'
                        }
                    ]
                },
                {
                    id:'120',
                    name: '用户统计',
                    icon: 'hdd',
                    children: [
                        {
                            id:'111',
                            name: '设备资源',
                            state: 'resource.dev',
                            icon: 'hdd'
                        },
                        {
                            id:'112',
                            name: '用户资源',
                            state: 'resource.dev',
                            icon: 'hdd'
                        }
                    ]
                }
            ]
        },
        {
            id:'200',
            name: '系统管理',
            state: null,
            icon: 'setting',
            children: [
                {
                    id:'210',
                    name: '用户管理',
                    state: 'system.state',
                    icon: 'user'
                },
                {
                    id:'220',
                    name: '部门管理',
                    state: 'system.dept',
                    icon: 'user'
                },
                {
                    id:'230',
                    name: '角色管理',
                    state: 'system.role',
                    icon: 'user'
                },
                {
                    id:'240',
                    name: '菜单管理',
                    state: 'system.menu',
                    icon: 'user'
                },
                {
                    id:'250',
                    name: '权限管理',
                    state: 'system.right',
                    icon: 'user'
                }
            ]
        }
    ]

    $scope.currentMenu = null
    $scope.currentOpen = null

    $scope.selectMenu = function (menu) {
        if (angular.isArray(menu.children) && menu.children.length > 0) {
            if ($scope.currentOpen && $scope.currentOpen.id == menu.id)
                $scope.currentOpen = null
            else
                $scope.currentOpen = menu
        }

        if (menu.state)
            $scope.currentMenu = menu
    }

}])