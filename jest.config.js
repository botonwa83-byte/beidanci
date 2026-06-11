module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '@react-native-async-storage/async-storage':
      '<rootDir>/__mocks__/asyncStorageMock.js',
  },
};
