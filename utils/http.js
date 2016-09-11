(function() {
'use strict'

    angular
        .module('tk.utils.http',['tk.config','tk.utils.crypto'])
        .factory('tkHttp', Service)

    Service.$inject = ['$http','_appConfig','tkCrypto']
    function Service($http,appConfig,tkCrypto) {

        var format = function (url, parmas) {
            _.mapObject(params, function (val, key) {
                params[key] = tkCrypto.encrypt(val)
            })

            _.chain(url.replace('://', '').replace(/\?/g, /\//).split('/'))
                .filter(function (val) {
                    return value.indexOf(':') == 0
                })
                .map(function (val) {
                    return value.replace(':', '')
                })
                .each(function (val) {
                    if (_.has(params, val)) {
                        url = url.replace(new RegExp(':' + val, 'g'), params[val])
                        params = _.omit(params, val)
                    } else {
                        url = url.replace(new RegExp(':' + val, 'g'), tkCrypto(''))
                    }
                })
        }

        var headers = function () {
            var sign = {
                appId: appConfig.appId,
                timestamp: new Date().getTime().toString(),
                signature: ''
            }

            var randomSeeds = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ]

            for (var i = 0; i < 8; i++) {
                sign.timestamp += randomSeeds[_.random(0, randomSeeds.length)].toString()
            }
            sign.signature = this.md5(this.encrypt(sign.timestamp + '|' + sign.appId + '|' + appConfig.key))

            return {
                'TK-Signature': btoa(JSON.stringify(sign)),
                'TK-Token': tk.token
            }
        }

        var transformRequest = function (data,headers) {
            return tkCrypto.encrypt(JSON.stringify(data))
        }
        
        var transformResponse = function (data,headers) {
            return headers('TK-Encrypted') == 'no' ? data : JSON.parse(tkCrypto.decrypt(data))
        }

        return {
            get: function (url,params,success,fail) {
                format(url, params)
                $http.get(url, {
                    params: params,
                    headers: headers,
                    transformResponse: transformResponse
                }).then(success, fail)
            }
        }
    }
})();