/** @type {import('jest').Config} */
module.exports = {
    // Basic configuration
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    // Root directory
    rootDir: '.',
    
    // Test file patterns
    testMatch: [
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.spec.ts',
    ],
    
    // Transform configuration
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    
    // Module resolution
    moduleNameMapping: {
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@frontend/(.*)$': '<rootDir>/src/frontend/$1',
        '^@backend/(.*)$': '<rootDir>/src/backend/$1',
    },
    
    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    
    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/*.spec.{ts,tsx}',
        '!src/frontend/vite-env.d.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    
    // Test environment configuration
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    
    // Verbose output
    verbose: true,
    
    // Clear mocks between tests
    clearMocks: true,
    
    // Timeout for tests
    testTimeout: 10000,
    
    // Projects for different environments
    projects: [
        {
            displayName: 'backend',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/src/backend/**/*.test.ts'],
            transform: {
                '^.+\\.ts$': 'ts-jest',
            },
        },
        {
            displayName: 'frontend',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/src/frontend/**/*.test.{ts,tsx}'],
            transform: {
                '^.+\\.tsx?$': 'ts-jest',
            },
            setupFilesAfterEnv: ['<rootDir>/src/frontend/test-setup.ts'],
        },
        {
            displayName: 'shared',
            testEnvironment: 'node',
            testMatch: ['<rootDir>/src/shared/**/*.test.ts'],
            transform: {
                '^.+\\.ts$': 'ts-jest',
            },
        },
    ],
}
