我们可以在package.json配置打包命令
```javascript
{
  //......
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
+    "build": "webpack --config webpack.config.js",
+    "dev": "webpack-dev-server"
  }
}

```
通过npm run build执行打包，npm run dev开启静态服务操作。  
在开启静态服务时需要在webpack.config.js中配置devServer，以打包dist文件夹为服务文件夹，如下所示  
参考文章 [https://webpack.docschina.org/configuration/dev-server/](https://webpack.docschina.org/configuration/dev-server/)
**webpack.config.js**
```javascript
module.exports = {
+  devServer: {
+    ports: 8080, //端口
+    contentBase: './dist', //以dist目录为打包文件夹
+    compress: true //一切服务都启用 gzip 压缩    
  }
}
```

开启静态服务，但是我们在打包生成后的dist目录自动生成index.html文件。此时我们需要用到HtmlWebpackPlugin,该插件将为你生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包。  
HtmlWebpackPlugin介绍：[https://github.com/jantimon/html-webpack-plugin#options](https://github.com/jantimon/html-webpack-plugin#options)   
options配置：[https://github.com/jantimon/html-webpack-plugin#options](https://github.com/jantimon/html-webpack-plugin#options) 

首先安装 
```javascript
npm i -D html-webpack-plugin
```
**webpack.config.js**
```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin(
    {
      filename: 'index.html',//生成的html文件名
      tempalte: './src/index.html',//以src目录下的index.html为模板
      minify:  {//生产模式才起作用，压缩生成的html文件
          collapseWhitespace: true,  //变成一行
          removeComments: true,//删除注释
      },
      hash: true//为html插入script引入生成hash值
    }
  )] //放置插件的数组
};
```
