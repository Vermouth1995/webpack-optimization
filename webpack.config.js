const HtmlWebpackPlugin = require("html-webpack-plugin");

const resolve = dir => require("path").join(__dirname, dir);
module.exports = {
	// 入口文件地址
	entry: "./src/index.js",
	// 输出文件地址
	output: {
		path: resolve("dist"),
		filename: "bundle.js"
	},
	// loader
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [resolve("src")],
				use: "babel-loader"
			}
		]
	},
	// plugin
	plugins: [new HtmlWebpackPlugin()]
};
