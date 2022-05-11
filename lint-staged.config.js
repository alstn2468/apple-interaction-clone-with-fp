module.exports = {
  'src/**/*.ts': () => 'tsc --noEmit --skipLibCheck',
  'src/**/*.{js,ts}': [
    'eslint --fix',
  ],
};
