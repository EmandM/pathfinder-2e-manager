import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  ignores: [
    'public/**',
    'node_modules/**',
    'dist/**',
    '.vscode/**',
  ],
}, {
  // Remember to specify the file glob here, otherwise it might cause the vue plugin to handle non-vue files
  files: ['**/*.vue'],
  rules: {
    'vue/no-mutating-props': ['error', {
      shallowOnly: true,
    }],
    'vue/singleline-html-element-content-newline': [0],
  },
}, {
  rules: {
    'no-console': [0],
    'ts/strict-boolean-expressions': [0],
    'e18e/prefer-regex-test': [0],
  },
})
