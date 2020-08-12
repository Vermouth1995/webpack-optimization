### 构建速度及体积优化策略

#### 一、统计分析

##### 初级分析
- 使用 webpack 内置 stats

``webpack --config webpack.config.js --json > stats.json``<br>
特点：输出构建的一些统计信息<br>
缺点：颗粒度较大，无法发现具体问题<br>

##### 速度分析
- 使用 speed-measure-webpack-plugin

##### 体积分析
- 使用 webpack-bundle-analyzer
- 使用 jarvis<br>
是一款webpack性能分析插件，性能分析的结果在浏览器显示，比 webpack-bundler-anazlyer 更美观清晰
![](https://user-images.githubusercontent.com/17866208/89979103-83f5f080-dca1-11ea-8d64-cea6ea7c7b38.png)

#### 二、优化手段

##### 构建速度优化

##### 构建体积优化
