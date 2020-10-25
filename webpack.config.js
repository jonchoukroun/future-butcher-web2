const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
};
