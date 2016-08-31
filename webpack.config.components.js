var webpack = require('webpack');

module.exports = {
    entry: './examples/components/app.js',

    output: {
        path: __dirname + '/examples/components/build',
        filename: 'bundle.js'
    },

    devServer: {
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 4000,
        contentBase: __dirname,
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                    cacheDirectory: true
                }
            }
        ]
        /* React Hot Loader
        loaders: [
            {
              test: /\.js$/,
              loaders: ['react-hot', 'babel?' + JSON.stringify({
                  cacheDirectory: true,
                  presets: ['es2015', 'react']
              })],
              exclude: /node_modules/
            }
        ]
        */
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
