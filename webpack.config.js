module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      // Force webpack to use the host app's peer dependencies
      // This prevents duplicate instances when using local packages
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom')
    }
  },
  module: {
    rules: [
      {
        // includes, excludes are in tsconfig.json
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    library: {
      type: 'commonjs'
    }
  },
  target: 'node',
  mode: 'development'
}

