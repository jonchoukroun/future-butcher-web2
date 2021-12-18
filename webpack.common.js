/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new ESLintWebpackPlugin({
            files: "src",
            extensions: [".ts", ".tsx", ".js", ".jsx"],
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
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: ["file-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
};
