const path = require('path');
const HWP = require('html-webpack-plugin');
module.exports = {
    entry: path.join(__dirname, '/src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist')
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['react']
                        }
                    }
                ],
            },
            {
                test: /\.css$/, 
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins:[
        new HWP(
           {template: path.join(__dirname,'/src/index.html')}
        )
    ]
 };