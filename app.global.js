'use strict'

angular.module('tk.global',[
    'ngResource'
])

.constant('__mode',{
    mode:'release' // devolop | release
})

.constant('__appConfig', {
    appId: '1ee0c7ce-74c1-11e6-b4aa-001b7838a80e',
    key: 'TDg1bEdIZWtJOVNPQTRXdG5JSExveDlM'
})

.constant('__apiConfig', {
    develop: {
        base: 'testData/',
        menu_query: 'menus.json'
    },
    release: {
        base: 'http://localhost:8080/api/',
        menu_query: 'menu'
    }
})
    
.factory('__crypto',['__appConfig',function (appConfig) {
    return {
        md5: function (input) {
            return CryptoJS.MD5(input).toString().toUpperCase();
        },
        encrypt: function (input) {
            var key = CryptoJS.enc.Base64.parse(appConfig.key)
            var encrypted = CryptoJS.TripleDES.encrypt(
                input,
                key,
                {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }
            )
            return CryptoJS.enc.Base64.parse(encrypted.toString()).toString().toUpperCase()
        },
        decrypt: function (input) {
            var key = CryptoJS.enc.Base64.parse(appConfig.key)
            var decrypted = CryptoJS.TripleDES.decrypt(
                {
                    ciphertext: CryptoJS.enc.Hex.parse(input.toString())
                },
                key,
                {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }
            )
            return decrypted.toString(CryptoJS.enc.Utf8)
        },
        encryptParams:function (input) {
            var that = this
            angular.forEach(input, function (value,name) {
                console.log(value)
                input[name] = that.encrypt(value)
            })
            return input
        },
        encryptObject:function (input) {
            console.log(input)
            return this.encrypt(JSON.stringify(input))
        },
        decryptObject:function (input) {
            return JSON.parse(this.decrypt(input))
        },
        sign: function () {
            var obj = {
                appId: appConfig.appId,
                timestamp: new Date().getTime().toString(),
                signature: ''
            }

            var randomSeeds = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                'a', 'b', 'c', 'd', 'e', 'f', 'g',
                'h', 'i', 'j', 'k', 'l', 'm', 'n',
                'o', 'p', 'q', 'r', 's', 't', 'u',
                'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G',
                'H', 'I', 'J', 'K', 'L', 'M', 'N',
                'O', 'P', 'Q', 'R', 'S', 'T', 'U',
                'V', 'W', 'X', 'Y', 'Z', 0
            ]
            for (var i = 0; i < 8; i++) {
                obj.timestamp += randomSeeds[Math.floor(randomSeeds.length * Math.random())].toString()
            }
            obj.signature = this.md5(this.encrypt(obj.timestamp + '|' + obj.appId + '|' + appConfig.key))
            return btoa(JSON.stringify(obj))
        }
    }
}])

.factory('__apiResource',['$resource','$http','__crypto',function ($resource,$http,crypto) {

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
                $http({
                    url: url,
                    method: 'GET',
                    params: params
                }).then(
                    function (res) {
                        success(res)
                    },
                    function (res) {
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



.factory('tkGlobal',['__mode','__apiConfig','__apiResource','__crypto',function (mode,apiConfig,apiResource,crypto) {
    var global = {
        api: {},
        resource: apiResource[mode.mode],
        crypto: crypto
    }

    angular.forEach(apiConfig[mode.mode], function (value, name) {
        if (name != 'base')
            global.api[name] = apiConfig[mode.mode].base + value
    })

    return global

}])