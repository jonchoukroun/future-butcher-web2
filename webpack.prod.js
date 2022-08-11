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
                    "https://8809bb8c7dc0466cbfef54ec16c730de@sentry.io/1341103",
                ),
            },
        }),
    ],
});
