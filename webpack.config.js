const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        main: './src/js/index.js',
        about: './src/js/about/index.js',
        analytics: './src/js/analytics/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
            {
                test: /\.css$/i,
                use: [(isDev ? 'style-loader' : {
                    loader: MiniCssExtractPlugin.loader,
                    options: { publicPath: '../'}
                }), 'css-loader', 'postcss-loader']
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            //publicPath: './src/images',
                            outputPath: 'images',
                            useRelativePath: true,
                            esModule: false
                        }
                    },

                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: false,
                        },
                    },

                ]
            },

            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            publicPath: '../vendor/fonts',
                            outputPath: 'vendor/fonts',
                            useRelativePath: true,
                            esModule: false
                        }
                    }
                ]
            }


            /*{
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader?name=./vendor/fonts/[name].[ext]'
            }*/
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].[contenthash].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default'],
            },
            canPrint: true
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/about/index.html',
            filename: 'about.html',
            chunks: ['about']
        }),
        new HtmlWebpackPlugin({
            inject: false,
            template: './src/analytics/index.html',
            filename: 'analytics.html',
            chunks: ['analytics']
        }),
        new WebpackMd5Hash(),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};