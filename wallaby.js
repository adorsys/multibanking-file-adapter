module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      '!src/**/*.test.ts',
      'test/api/*.ts',
    ],
    tests: [
      'src/**/*.test.ts',
      'test/**/*.test.ts',
    ],
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(),
    },
    env: {
      type: 'node',
    },
    testFramework: 'ava',
  }
}
