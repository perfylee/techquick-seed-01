'use strict'

angular.module('tk.global',[
    'ngResource'
])

.constant('__mode',{
    mode:'develop' // devolop | release
})

.constant('__apiConfig', {
    develop: {
        base: 'testData/',
        menu_query: 'menus.json'
    },
    release: {
        base:'http://10.0.0.1/api/'
    }
})

.factory('__apiResource',['$resource',function ($resource) {

    return {
        develop: {
            create: function (url, params, success, fail) {
                $resource(url, null, {save: {method: 'post', isArray: false}}).save(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            update: function (url, params, success, fail) {
                $resource(url, null, {update: {method: 'put', isArray: false}}).update(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            read: function (url, params, success, fail) {
                $resource(url, null, {query: {method: 'get', isArray: false}}).query(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            delete: function (url, params, success, fail) {
                $resource(url, null, {delete: {method: 'delete', isArray: false}}).delete(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            }
        },
        release: {
            create: function (url, params, success, fail) {
                $resource(url, null, {save: {method: 'post', isArray: false}}).save(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            update: function (url, params, success, fail) {
                $resource(url, null, {update: {method: 'put', isArray: false}}).update(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            read: function (url, params, success, fail) {
                $resource(url, null, {query: {method: 'get', isArray: false}}).query(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            },
            delete: function (url, params, success, fail) {
                $resource(url, null, {delete: {method: 'delete', isArray: false}}).delete(
                    params,
                    function (res) {
                        success(res)
                    }, function () {
                        fail()
                    }
                )
            }
        }

    }

}])



.factory('tkGlobal',['__mode','__apiConfig','__apiResource',function (mode,apiConfig,apiResource) {
    var global = {
        api: {},
        resource: apiResource[mode.mode]
    }

    angular.forEach(apiConfig[mode.mode], function (value, name) {
        if (name != 'base')
            global.api[name] = apiConfig[mode.mode].base + value
    })

    return global

}])