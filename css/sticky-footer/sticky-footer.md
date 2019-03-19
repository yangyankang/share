### 我们在开发的过程中会碰到内容很少，然后底部没有固定到底部的问题，因此，sticky-footer很关键。在这里我推荐两种方法
#### 方法1：使用flex布局，具体的可以看该目录下的demo1，其主要原理就是利用改变flex主轴方向为纵轴，内容部分设为flex：1，就是占主轴方向的剩下部分，即100vh-footer的高度（100vh相当于视图高度，1vh=1%*视图的高度）,示例请看demo1.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>sticky-footer-demo1</title>
  <style>
    body {
      display: flex;
      flex-flow: column;
      min-height: 100vh;
      padding: 0;
      margin: 0;
    }
    .wrapper {
      flex: 1
    }
    .footer {
      /* flex为0可写可不写，因为.wrapper会占减去footer剩下位置 */
      /* flex: 0; */
      height: 80px;
      background: pink;
      color: #000;
    }

  </style>
</head>
<body>
  <div class="wrapper">我是wrapper</div>
  <div class="footer">我是底部</div>
</body>
</html>
```
#### 方法2 ：就是把html，body高度设为100%，wrapper部分设置成min-height：100%；然后给wrapper下的内容设置padding-bottom：footer的高度； 最后给footer设置margin-top：-footer的高度，相当于把footer往上拉了和footer一样的高度，详细示例请看demo2.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>sticky-footer-demo2</title>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    html,body{
      height: 100%;
    }
    body > .wrapper {
      min-height: 100%;
    }
    .content {
      padding-bottom: 90px;/*必须与footer的高度保持一致*/
      background: green;
    }
    .footer {
      position: relative;
      margin-top: -90px; /*相当于把footer向上拉了90px*/
      height: 90px;
      background: pink;
      }
      .clearfix {
        *zoom: 1;
      }
      .clearfix::after {
        content: '';
        display: block;
        height: 0;
        line-height: 0;
        visibility: hidden;
        clear: both;
      }
  </style>
</head>
<body>
  <div class="wrapper clearfix">
    <div class="content">我是内容</div>
  </div>
  <div class="footer">我是底部</div>
</body>
</html>
```