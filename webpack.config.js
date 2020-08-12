const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Jarvis = require("webpack-jarvis");

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.join(__dirname, "dist"),
		filename: "bundle.js"
	},
	resolve: {
		modules: [path.resolve(__dirname, "node_modules")]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: "babel-loader",
				include: [path.join(__dirname, "src")]
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				include: [path.join(__dirname, "src")]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
			filename: "index.html"
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
		new Jarvis({
			watchOnly: true,
			port: 10086
		})
	]
};
