我们在打包后的文件在一些时候需要进行调试，这是时候我们就需要使用devtool进行代码调试 ，相关介绍可以看[https://webpack.js.org/configuration/devtool#devtool](https://webpack.js.org/configuration/devtool#devtool)
主要配置如下
```javascript
module.exports = {
  ....,
  devtool: 'source-map' 
}
```
devtool常用参数描述如下
> 1.source-map: 会单独生成一sourcemap文件 出错了， 会标识当前的列和行
> 2.evel-source-map: 不会产生单独的文件，但是可以显示行和列
> 3.cheap-module-source-map: 不会产生列 ，但是是一个单数的映射文件，产生后可以作为保留用。
> 4.cheap-module-eval-source-map:不会产生文件，集成在打包后的文件中，不会产生列

