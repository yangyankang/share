let isAndroid =
  navigator.userAgent.indexOf('Android') > -1 ||
  navigator.userAgent.indexOf('Adr') > -1
let isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

/**
 * @description 创建一些设置
 * @param {function} callback
 */
function setupWebViewJavascriptBridge(callback) {
  // android 使用
  if (isAndroid) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener(
        'WebViewJavascriptBrigeReady',
        function() {
          callback(WebViewJavascriptBridge)
        },
        false
      )
    }
    console.log('tag', '安卓')
    sessionStorage.phoneType = 'android'
  }

  // IOS使用
  if (isiOS) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    let WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
    console.log('tag', 'ios')
    sessionStorage.phoneType = 'ios'
  }
}

// 注册回调函数  初始化函数(android需要初始化,ios 不需要)
setupWebViewJavascriptBridge(function(bridge) {
  if (isAndroid) {
    //初始化
    bridge.init(function(message, responseCallback) {
      const data = {
        'Javascript Responds': 'Wee!'
      }
      responseCallback(data)
    })
  }
})

export default {
  // js调用App方法 (参数分别为: app提供的方法名 传给app的数据  回调)
  callHandler(name, data, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.callHandler(name, data, callback)
    })
  },

  // App调js方法 (参数分别为:js提供的方法名 回调)
  registerHandler(name, callback) {
    setupWebViewJavascriptBridge(function(bridge) {
      bridge.registerHandler(name, function(data, responseCallback) {
        callback(data, responseCallback)
      })
    })
  }
}
