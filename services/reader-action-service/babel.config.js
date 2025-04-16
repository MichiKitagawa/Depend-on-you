// TypeScript構文を使わない純粋なJavaScript記述に修正
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ]
};