import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
    overrides: {
      'ts/strict-boolean-expressions': [0],
    },
  },
  vue: {
    overrides: {
      'vue/no-mutating-props': ['error', {
        shallowOnly: true,
      }],
      'vue/singleline-html-element-content-newline': [0],
    },
  },
}, {
  ignores: [
    'public/**',
    'node_modules/**',
    'dist/**',
    '.vscode/**',
  ],
}, {
  rules: {
    'no-console': [0],
  },
})
