const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasureWebpackPlugin = require("speed-measure-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const Jarvis = require("webpack-jarvis");
const TerserPlugin = require("terser-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const smp = new SpeedMeasureWebpackPlugin();

module.exports = smp.wrap({
	mode: "production",
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js"
	},
	resolve: {
		modules: [path.resolve(__dirname, "node_modules")]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: "babel-loader?cacheDirectory=true",
				include: [path.resolve(__dirname, "src")]
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				include: [path.resolve(__dirname, "src")]
			}
		]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				cache: true
			})
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src/index.html"),
			filename: "index.html"
		}),
		new MiniCssExtractPlugin(),
		new BundleAnalyzerPlugin(),
		new HardSourceWebpackPlugin()
		// new webpack.DllReferencePlugin({
		//     manifest: require('./build/library/library.json')
		// })
		// new Jarvis({
		// 	watchOnly: true,
		// 	port: 10086
		// })
	]
});
