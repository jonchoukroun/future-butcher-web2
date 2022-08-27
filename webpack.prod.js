/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    devtool: "source-map",
    plugins: [
        new DefinePlugin({
            "process.env": {
                API_URL: JSON.stringify("wss://api.futurebutcher.com/socket"),
                SENTRY_DSN: JSON.stringify(
                    "https://9ed2aa2dc4824f69845582808282c525@o213338.ingest.sentry.io/6639536",
                ),
            },
        }),
    ],
});
