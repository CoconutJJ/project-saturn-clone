const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const config = {
    entry: ["./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        publicPath: "/static",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            mimetype: "image/png",
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: "file-loader",
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    devServer: {
        contentBase: "./dist",
    },
    plugins: [
        new HtmlWebpackPlugin({
            appMountId: "app",
            filename: "index.html",
            template: "./src/Templates/index.html",
        }),
    ],
    optimization: {
        runtimeChunk: "single",
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
};

module.exports = config;
