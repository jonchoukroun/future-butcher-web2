/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const { DefinePlugin } = require("webpack");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new DefinePlugin({
            "process.env": {
                API_URL: JSON.stringify("wss://api.futurebutcher.com/socket"),
            },
        }),
    ],
});
