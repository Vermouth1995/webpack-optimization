const HtmlWebpackPlugin = require("html-webpack-plugin");

const resolve = dir => require("path").join(__dirname, dir);

module.exports = {
	entry: "./src/index.js",
	output: {
		path: resolve("dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [resolve("src")],
				use: "babel-loader"
			}
		]
	},
	plugins: [new HtmlWebpackPlugin()]
};
