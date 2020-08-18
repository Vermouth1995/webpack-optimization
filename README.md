### webpack 构建速度及体积优化策略

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
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const webpackConfig = smp.wrap({
    ...
    plugins: [
        new MyPlugin(),
        new MyOtherPlugin()
    ]
    ...
});
```
1、分析记录整个打包过程总耗时<br>
2、分析记录每个插件和 loader 的耗时情况<br><br>
![](https://user-images.githubusercontent.com/17866208/90364067-58ef1080-e096-11ea-9d25-50bb3796502c.png)

##### 体积分析
- 使用 webpack-bundle-analyzer<br>
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    ...
    plugins: [
        new BundleAnalyzerPlugin()
    ]
    ...
};
```
构建完成后会自动显示文件大小<br>
1、分析依赖的第三方模块体积大小<br>
2、分析业务里的组件体积大小<br><br>
![](https://cloud.githubusercontent.com/assets/302213/20628702/93f72404-b338-11e6-92d4-9a365550a701.gif)

- 使用 jarvis<br>
```javascript
const Jarvis = require('webpack-jarvis');
module.exports = {
    ...
    plugins: [
        new Jarvis({
            port: 1337 // optional: set a port
        })
    ]
    ...
};
```
好看！<br><br>
![](https://user-images.githubusercontent.com/17866208/89979103-83f5f080-dca1-11ea-8d64-cea6ea7c7b38.png)

#### 二、优化手段
1、使用高版本 webpack<br><br>
![](https://user-images.githubusercontent.com/17866208/90355412-d6a72200-e07e-11ea-8700-9ea26d96ab78.png)

2、多进程并行解析资源模块<br>
- thread-loader<br>

原理：每次 webpack 解析一个模块，thread-loader 会将它及它的依赖分配给 worker 进程。
```javascript
module.exports = {
    ...
    module: {
        rules: [{
            test: /\.js$/,
            use: [{
                loader: 'thread-loader',
                options: {
                    workers: 3
                }
            },
            'babel-loader'
            ]
        }]
    }
    ...
};
```

- HappyPack<br>

原理：每次 webpack 解析一个模块，HappyPack 会将它及它的依赖分配到 worker 进程。
```javascript
const HappyPack = require('happypack');
module.exports = {
    ···
    plugins: [
        new HappyPack({
            id: 'jsx',
            threads: 4,
            loaders: [ 'babel-loader' ]
        }),
        new HappyPack({
            id: 'styles',
            threads: 2,
            loaders: [ 'style-loader', 'css-loader', 'less-loader' ]
        })
    ]
    ···
}
```

3、多进程并行压缩代码<br>
- 使用 webpack-parallel-uglify-plugin 插件
```javascript
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
module.exports = {
    ···
    plugins: [
        new ParallelUglifyPlugin({
            uglifyJS: {
                output: {
                    beautify: false,
                    comments: false
                },
                compress: {
                    warnings: false,
                    drop_console: true,
                    collapse_vars: true
                }
            }
        })
    ]
    ···
}
```

- 使用 uglify-webpack-plugin 插件，开启 parallel 参数（老的 webpack 版本使用，不支持压缩ES6的语法）
```javascript
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
    ···
    optimization: {
        minimizer: [new UglifyJsPlugin()],
    }
    ···
};
```

- 使用 terser-webpack-plugin 插件，开启 parallel 参数（新的 webpack 版本使用，支持压缩ES6的语法）
```javascript
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    ···
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true
            })
        ],
    }
    ···
};
```

4、分包<br>
- 使用 html-webpack-externals-plugin，设置 externals<br>

原理：将 react，react-dom 等公共基础包通过 cdn 方式引入，不打入 bundle 中
```javascript
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
module.exports = {
    ···
	plugins: [
        new HtmlWebpackExternalsPlugin({
            externals: [{
                module: 'react',
                entry: 'https://unpkg.com/react@16/umd/react.development.js',
                global: 'React'
            }]
        })
    ]
    ···
};
```

- 预编译资源模块，使用 DLLPlugin 分包，DllReferencePlugin对 manifest.json 引用<br>

原理：将 react，react-dom 等公共基础包打包成一个文件
```javascript
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        library: ['react','react-dom']
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.resolve(__dirname,'./build/library'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]_[hash]',
            path: path.resolve(__dirname,'./build/library/[name].json')
        })
    ]
}
```
```javascript
module.exports = {
    ···
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: require('./build/library/library.json')
        })
    ]
    ···
}
```

5、缓存（提升二次构建速度）<br>
- babel-loader 开启缓存
```javascript
module.exports = {
    ···
	module: {
        rules: [{
            test: /\.js$/,
            use: [ 'babel-loader?cacheDirectory=true' ]
        }]
    }
    ···
};
```

- terset-webpack-plugin 开启缓存
```javascript
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    ···
    optimization: {
        minimizer: [
            new TerserPlugin({
                parallel: true,
                cache: true
            })
        ],
    }
    ···
};
```

- 使用 cache-loader 或者 hard-source-webpack-plugin
```javascript
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    ···
    plugins: [ new HardSourceWebpackPlugin() ]
    ···
};
```

6、缩小构建目标<br>
- 尽可能少的构建模块
```javascript
module.exports = {
    ···
	module: {
        rules: [{
            test: /\.js$/,
            use: [ 'babel-loader' ],
            exclude: 'node_modules'
        }]
    }
    ···
};
```

- 减少文件搜索范围<br>

（1）优化 resolve.modules 配置（减少模块搜索层级）<br>
（2）优化 resolve.mainFields 配置<br>
（3）优化 resolve.extensions 配置<br>
（4）合理使用 alias
```javascript
module.exports = {
    ···
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        mainFields: ['main'],
        extensions: ['.js'],
        alias: {
            'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react.production.min.js')
        }
    }
    ···
};
```

7、Tree Shaking<br>
