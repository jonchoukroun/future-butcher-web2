/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.ts",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        open: true,
    },
    plugins: [
        new ESLintWebpackPlugin({
            files: "src",
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            failOnError: true,
            emitWarning: true,
            emitError: true,
        }),
        new HtmlWebpackPlugin({
            template: "src/index.html",
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        configFile: path.resolve("./tsconfig.json"),
                    },
                },
                exclude: /node_modules/,
            },
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
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
};
