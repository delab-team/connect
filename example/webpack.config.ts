/* eslint-disable import/no-extraneous-dependencies */

import { Configuration, SourceMapDevToolPlugin, ProvidePlugin } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import 'webpack-dev-server'

const config: Configuration = {
    mode: 'none',
    entry: { app: path.join(__dirname, 'src', 'index.tsx') },
    target: 'web',
    devtool: 'inline-source-map',
    devServer: {
        static: { directory: path.join(__dirname, 'public') },
        compress: true,
        https: false,
        port: 8080,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(css|scss)$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [ 'source-map-loader' ]
            },
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: [
                {
                  loader: 'file-loader',
                  options: {
                    limit: 10000
                  }
                }
              ]
            }
        ]
    },
    ignoreWarnings: [/Failed to parse source map/],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.join(__dirname, 'public', 'index.html') }),
        new SourceMapDevToolPlugin({ filename: '[file].map' }),
        new ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new ProvidePlugin({ process: 'process/browser.js' })
    ],
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ],
        alias: { process: 'process/browser.js',
            // react: require.resolve("react"),
            // 'react-dom': require.resolve('react-dom')
        },
        fallback: {
            util: require.resolve('util/'),
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            assert: require.resolve('assert'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            url: require.resolve('url')
        }
    }
}

// eslint-disable-next-line import/no-default-export
export default config
