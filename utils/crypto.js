(function() {
    'use strict'

    angular
        .module('tk.utils.crypto',['tk.config'])
        .factory('tkCrypto', Service)

    Service.$inject = ['_appConfig']
    function Service(appConfig) {
        return {
            md5: function (input) {
                return CryptoJS.MD5(input).toString().toUpperCase()
            },
            encrypt: function (input) {
                var encrypted = CryptoJS.TripleDES.encrypt(
                    input,
                    CryptoJS.enc.Base64.parse(appConfig.key),
                    {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                )
                return CryptoJS.enc.Base64.parse(encrypted.toString()).toString().toUpperCase()
            },
            decrypt: function (input) {
                var decrypted = CryptoJS.TripleDES.decrypt(
                    {
                        ciphertext: CryptoJS.enc.Hex.parse(input.toString())
                    },
                    CryptoJS.enc.Base64.parse(appConfig.key),
                    {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                )
                return decrypted.toString(CryptoJS.enc.Utf8)
            },
            sign:function () {
                var obj = {
                    appId: appConfig.appId,
                    timestamp: new Date().getTime().toString(),
                    signature: ''
                }

                var seed = [
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
                ]

                for (var i = 0; i < 8; i++) {
                    obj.timestamp += seed[_.random(0, seed.length-1)].toString()
                }

                obj.signature = this.md5(this.encrypt(obj.timestamp + '|' + obj.appId + '|' + appConfig.key))

                return btoa(JSON.stringify(obj))
            }
        }
    }
})()