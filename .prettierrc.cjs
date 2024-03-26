/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'always',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  plugins: ['prettier-plugin-tailwindcss']
}

module.exports = config
