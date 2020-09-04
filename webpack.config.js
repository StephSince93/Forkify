const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//console.log(path.resolve(__dirname, 'dist/js'))
module.exports = {
    entry: './src/js/index.js', // First proerty Webpack looks at
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
    // mode: 'development' // Compiles for developement, quick and easy, Will be moved to npm scripts
}