import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  unocss: true,
  vue: true,
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
}, {
  rules: {
    'no-console': [0],
    'ts/strict-boolean-expressions': [0],
  },
})
