const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = { 
    devtool: 'cheap-module-eval-source-map',
    entry: {
        createQuiz: './src/js/createQuiz.js',
        login: './src/js/login.js',
        home: './src/js/home.js',
        addQuestion: './src/js/addQuestion.js',
        playerHome: './src/js/playerHome.js',
        playQuiz: './src/js/playQuiz.js'
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
    mode: 'development',
    plugins: [
        new CopyWebpackPlugin([{ 
            from: './src/css', 
            to: 'css'
        }])
    ],
    node: {
        dns: 'mock',
        net: 'mock'
    }
};