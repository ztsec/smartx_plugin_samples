const path = require('path')
const os = require("os");

const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')

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
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.sass$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'vue-html-loader'
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        extractCSS: true,
                        loaders: {
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            less: 'vue-style-loader!css-loader!less-loader'
                        }
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'imgs/[name].[ext]'
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    query: {
                        limit: 10000,
                        name: 'fonts/[name].[ext]'
                    }
                }
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: 'styles.css' }),
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
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            ts: {
                appendTsSuffixTo: [/\.vue$/]
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', '.css']
    }
}
