当项目非常大的时候可以使用happypack多线程打包来优化打包性能,参考链接：[https://www.npmjs.com/package/happypack](https://www.npmjs.com/package/happypack) 
 先安装happypack  
 ```javascript
 npm i -D happypack
 ```
 用法如下     
**webpack.config.js**
```javascript
const Happypack = require('happypack');
module.exports = {
  //....
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'happypack/loader?id=js',
        /* use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }, */
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // use: ['style-loader','css-loader']
        use: 'Happypack/loader?id=css'
      }
    ]
  }
  ,
  plugins: [
    new Happypack({
      id: 'css',
      use: ['style-loader','css-loader']
    }),
    new Happypack({
      id: 'js',
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      ] 
    })
  ],
  // devtool: 'source-map'
}
```
当项目比较小的时候开启多线程也会消耗一定的性能，用多线程打包会比不用的时间更长（前提是项目非常小的情况下）。