### 1）webpack可以进行0配置
首先我们得在项目本地安装webpack webpack-cli  
```javacript
npm i -D webpack webpack-cli
```
我们没有webpack.config.js配置文件化，通过执行npx webpack 它也可以打包。
### 2）webpack自定义打包
我们在根目录下配置webpack.config.js，新建src目录，该目录一般放我们的项目文件，在src目录下新建入口index.js
**index.js**
```javascript
console.log(11111);
```
新建src/index.html文件
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
+     <script src="./dist/index.js"></script>
/* 引入打包后的文件 */
</body>
</html>
```
**webpack.config.js**
```javascript
const path = require('path');

module.exports = {
  mode: 'production', //模式两种 开发development 生产production
  entry: './src/index.js',//入口
  output: { //打包输出配置
    filename: 'index.js',//打包后的文件名
    path: path.resolve(__dirname,'dist')//绝对路径，打包后所在的文件夹
  }
}
``` 
这样我们再执行npx webpack ,它就会执行webpack.config.js文件进行打包。
