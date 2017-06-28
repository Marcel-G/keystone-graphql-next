import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')

export default {
  entry: 'routes.js',
  external: Object.keys(pkg.dependencies),
  plugins: [
    babel(),
    commonjs()
  ],
  targets: [{
    dest: 'routes.dist.js',
    format: 'cjs',
    sourceMap: false
  }]
}
