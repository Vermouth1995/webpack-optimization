const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Jarvis = require("webpack-jarvis");

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: [path.join(__dirname, "src")],
				use: "babel-loader"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
			filename: "index.html"
		}),
		new Jarvis({
			watchOnly: false,
			port: 10086
		})
	]
};
