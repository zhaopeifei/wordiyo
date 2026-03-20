module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'prettier'],
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/no-custom-classname': 'off',
  },
  settings: {
    tailwindcss: {
      groupByResponsive: true,
      callees: ['classnames', 'clsx', 'ctl'],
    },
  },
};
