### 构建速度及体积优化策略

#### 一、统计分析

##### 初级分析
- 使用 webpack 内置 stats<br>
``webpack --config webpack.config.js --json > stats.json``<br>
特点：输出构建的一些统计信息<br>
缺点：颗粒度较大，无法发现具体问题<br><br>
![](https://user-images.githubusercontent.com/17866208/90353592-313d7f80-e079-11ea-951a-01b357551ba0.png)

##### 速度分析
- 使用 speed-measure-webpack-plugin<br>
```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
	plugins: [
		new MyPlugin(),
		new MyOtherPlugin()
	]
});
```
1、分析记录整个打包过程总耗时<br>
2、分析记录每个插件和loader的耗时情况<br><br>
![](https://raw.githubusercontent.com/stephencookdev/speed-measure-webpack-plugin/HEAD/preview.png)

##### 体积分析
- 使用 webpack-bundle-analyzer<br>
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
	plugins: [
		new BundleAnalyzerPlugin()
	]
}
```
构建完成后会自动显示文件大小<br>
1、分析依赖的第三方模块体积大小<br>
2、分析业务里的组件体积大小<br><br>
![](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

- 使用 jarvis<br>
```javascript
const Jarvis = require("webpack-jarvis");
plugins: [
	new Jarvis({
		port: 1337 // optional: set a port
	})
];
```
更美观<br><br>
![](https://user-images.githubusercontent.com/17866208/89979103-83f5f080-dca1-11ea-8d64-cea6ea7c7b38.png)

#### 二、优化手段

##### 构建速度优化
1、使用高版本 webpack

##### 构建体积优化
