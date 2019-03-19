*  (1)cleanWebpackPlugin 参考文章：[https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder](https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder)
*  (2) copyWebpackPlugin 参考文章：[https://webpack.js.org/plugins/copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin)
* (3) bannerPlugin 内置 [https://webpack.js.org/plugins/banner-plugin](https://webpack.js.org/plugins/banner-plugin)


### 1.cleanWebpackPlugin的使用
```javascript
npm install --save-dev clean-webpack-plugin
```
```javascript
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
  module.exports = {
    entry: {
      app: './src/index.js'
    },
    plugins: [
+     new CleanWebpackPlugin(['dist/*']) //每次打包前清空dist目录
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

### 2.CopyWebpackPlugin的使用

```javascript
npm install copy-webpack-plugin --save-dev
```

webpack.config.js
```javascript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: 'source', to: 'dist' },//从source目录赋值到dist目录下
    ]),
  ],
};
```
### 3.BannerPlugin的使用
描述： 给所有js的头部一个注释
```javascript
const webpack = require('webpack');

module.exports = {
  plugins: [
    webpack.BannerPlugin('maked by Tommy_Yang')
  ]
};
```



