//import { tslint } from 'rollup-plugin-tslint'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import { uglify as uglifyJS } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'

const configs = []

for (const format of ['umd', 'cjs', 'amd', 'esm']) {
  for (const productive of [false, true]) {
    configs.push(createConfig(format, productive))
  }
}

export default configs

// --- locals -------------------------------------------------------

function createConfig(moduleFormat, productive) {
  return {
    input: 'src/main/index.ts',

    output: {
      file: productive
        ? `dist/js-stores.${moduleFormat}.production.js`
        : `dist/js-stores.${moduleFormat}.development.js`,

      format: moduleFormat,
      name: 'jsStores', 
      sourcemap: productive ? false : 'inline',

      globals: {
        'immer': 'Immer'
      },

      external: ['immer']
    },

    plugins: [
      resolve(),
      commonjs(),
      // tslint({
      //}),
      replace({
        exclude: 'node_modules/**',
        delimiters: ['', ''],

        values: {
          'process.env.NODE_ENV': productive ? "'production'" : "'development'"
        }
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
      productive && (moduleFormat === 'esm' ? terser() : uglifyJS()),
      productive && gzip()
    ],
  }
}
