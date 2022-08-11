/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { merge } = require("webpack-merge");
const { DefinePlugin } = require("webpack");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3000,
    },
    plugins: [
        new DefinePlugin({
            "process.env": {
                REACT_APP_API_URL: JSON.stringify("ws://localhost:5000/socket"),
            },
        }),
    ],
});
