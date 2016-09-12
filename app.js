'use strict'

var runtime = {
    //可放在cookie里
    token: ''
}

angular.module('tk',[
    'ui.router',
    'tk.config',
    'tk.utils.crypto',
    'tk.index.login',
    'tk.index.index',
    'tk.home'
])

/**
 * http拦截处理API请求
 * 主要用于请求参数的加密和响应内容的解密以及URL自动格式化
 */
.factory('HttpInterceptor',['tkCrypto','_appConfig',function (tkCrypto,appConfig) {
    return {

        /**
         * http请求拦截处理
         * @param config
         * @returns {*}
         */
        request: function (config) {
            if(config.url.indexOf('/api/') == 0) {
                //用于鉴权的头部签名和会话
                config.headers[appConfig.header.signature] = tkCrypto.sign()
                config.headers[appConfig.header.token] = runtime.token

                //get参数加密
                config.params = config.params || {}
                _.mapObject(config.params, function (val, key) {
                    //return val = tkCrypto.encrypt(val)
                    config.params[key] = tkCrypto.encrypt(val)
                })

                //重写请求的URL
                //自动填充URL上的:name占位符
                _.chain(config.url.replace('://', '').replace(/\?/g, /\//).split('/'))
                    .filter(function (val) {
                        return val.indexOf(':') == 0
                    })
                    .each(function (val) {
                        val = val.replace(':', '')
                        if (_.has(config.params, val)) {
                            config.url = config.url.replace(new RegExp(':' + val, 'g'), config.params[val])
                            config.params = _.omit(config.params, val)
                        } else {
                            config.url = config.url.replace(new RegExp(':' + val, 'g'), tkCrypto.encrypt(''))
                        }
                    })

                //URL随机数
                config.params._r = Math.random()

                //post参数加密
                if (!_.isNull(config.data) && !_.isUndefined(config.data)) {
                    config.data = tkCrypto.encrypt(JSON.stringify(config.data))
                }
            }

            return config
        },

        /**
         * http响应拦截处理
         * @param config
         * @returns {*}
         */
        response: function (response) {
            if(response.config.url.indexOf('/api/') == 0) {
                //除非响应包含指定的头(TK-Encrypted)，否则视为密文进行解密
                if (!_.has(response.headers(), appConfig.header.unEncrypt.toLowerCase())) {
                    response.data = JSON.parse(tkCrypto.decrypt(response.data))
                }
            }

            return response
        }

    }
}])

.config(['$httpProvider','$stateProvider','$urlRouterProvider',function ($httpProvider,$stateProvider,$urlRouterProvider) {

    //httpProvider注入拦截
    $httpProvider.interceptors.push('HttpInterceptor')

    $urlRouterProvider.otherwise('/login')


    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/modules/index/view/login.html',
        controller: 'loginCtrl'
    }).state('index', {
        abstract: true,
        templateUrl: '/modules/index/view/index.html',
        controller: 'indexCtrl'
    }).state('index.home', {
        url: '/home',
        templateUrl: '/modules/home/view/index.html',
        controller:'homeCtrl'
    }).state('404', {
        url: '/404',
        template: '访问的页面不存在'
    })

}])