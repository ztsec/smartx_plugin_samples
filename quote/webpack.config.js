const path = require('path')
const os = require("os");

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let pluginRootPath = path.join(os.homedir(), ".xtp-smart", "plugins");
let mode = 'development';
let devtool = '#cheap-module-eval-source-map';
if (process.env.NODE_ENV === "production") {
    mode = 'production';
    devtool = "";
    pluginRootPath = path.join(__dirname, "dist");
}

console.info("编译产物路径：", pluginRootPath);

module.exports = {
    mode: mode,
    devtool: devtool,
    target: "web",
    entry: {
        index: path.join(__dirname, './src/index.ts')
    },
    output: {
        filename: '[name].js',
        // libraryTarget: 'commonjs',
        path: path.join(pluginRootPath, path.basename(__dirname))
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json'),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.ejs'),
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true
            },
            nodeModules: false
        }),
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, './package.json'),
                to: path.join(pluginRootPath, path.basename(__dirname), 'package.json')
            }
        ]),
    ]
}
