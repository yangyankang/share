watch主要用于实时监控文件变化并打包。默认watch:false
可以看webpack中对watch的描述[https://webpack.js.org/configuration/watch#watchoptionspoll](https://webpack.js.org/configuration/watch#watchoptionspoll)
```javascript
module.exports = {
  ...,
  watch: true, //开启监控
  watchOptions: { //监控选项
    aggregateTimeout: 300,//防抖动 ， 一直输入代码然后停止后300毫秒才开始打包
    poll: 1000,//每隔1000毫秒开始打包
    ignored: /node_modules/ //忽略不需要监控的文件夹
  }
}
```
