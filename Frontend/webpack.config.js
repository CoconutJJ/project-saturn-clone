const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
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
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: "url-loader",
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
            {
                test: /\.ttf$/,
                use: ['file-loader']
            }
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
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            // languages: ['json', 'python','cpp']
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
