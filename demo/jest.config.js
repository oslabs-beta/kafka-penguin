module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    roots: [
        "<rootDir>/__tests__"
    ],
    testEnvironment: "node",
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
};