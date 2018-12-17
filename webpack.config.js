const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const isProd = !!(process.env.NODE_ENV == "prod");

module.exports = { 
    devtool: isProd ? undefined : 'cheap-module-eval-source-map',
    entry: {
        createQuiz: './src/js/createQuiz.js',
        login: './src/js/login.js',
        home: './src/js/home.js',
        addQuestion: './src/js/addQuestion.js',
        playerHome: './src/js/playerHome.js',
        playQuiz: './src/js/playQuiz.js',
        playLiveQuiz: './src/js/playLiveQuiz.js',
        conductQuiz: './src/js/conductQuiz.js',
        myResult: './src/js/myResult.js'
    },
    output: {
        path: __dirname + '/build',
        filename: 'js/[name].bundle.js'
    },
    module: {   
        rules: [{
            test: /\.js$/, 
            exclude: /node_modules/,
            use: [{
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react']
                }
            }]
        }]
    },
    mode: 'production',
    plugins: [
        new CopyWebpackPlugin([{ 
            from: './src/css', 
            to: 'css'
        }])
    ],
    node: {
        dns: 'mock',
        net: 'mock'
    },
    watchOptions: {
        ignored: ['build', 'node_modules']
    },
    optimization: isProd ? undefined : {
        minimizer: [new UglifyJsPlugin({
            test: /\.js(\?.*)?$/i
        })]
    }
};