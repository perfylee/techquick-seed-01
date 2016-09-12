(function () {
    'use strict'
    angular.module('tk.config', [])

        .constant('_modeConfig', {
            mode: 'release' // devolop | release
        })
        .constant('_appConfig', {
            appId: '1ee0c7ce-74c1-11e6-b4aa-001b7838a80e',
            key: 'TDg1bEdIZWtJOVNPQTRXdG5JSExveDlM',
            header: {
                signature: 'TK-Signature',
                token: 'TK-Token',
                unEncrypt: 'TK-Encrypted',
                unEncryptValue: 'no'
            }
        })
        .constant('_apiConfig', {
            release: {
                apiBase: '/api/',
                api: {
                    user_login: 'user/login',
                    menu_user: 'menu/user'
                }
            },
            devolop: {
                apiBase: '/testData',
                api: {
                    user_login: 'login.json',
                    menu_user: 'menu.json'
                }
            }
        })

})()
