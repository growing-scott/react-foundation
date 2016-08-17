module.exports = {
    entry: './examples/app.js',
 
    output: {
        path: __dirname + '/examples/build',
        filename: 'bundle.js'
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
    }
}