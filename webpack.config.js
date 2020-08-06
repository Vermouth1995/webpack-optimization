const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

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
		})
	]
};
