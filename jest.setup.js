/**
 * Jest global setup configuration
 */

// Global test timeout
jest.setTimeout(10000)

// Mock console methods in tests (can be overridden per test)
global.console = {
    ...console,
    // Uncomment to suppress console output during tests
    // log: jest.fn(),
    // debug: jest.fn(),
    // info: jest.fn(),
    // warn: jest.fn(),
    // error: jest.fn(),
}

// Mock environment variables
process.env.NODE_ENV = 'test'

// TODO: Add global mocks here as needed
// Example: Mock external APIs, services, etc.

// Global test utilities
global.testUtils = {
    // Add common test utilities here
    createMockUser: () => ({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
    }),
    
    createMockProject: () => ({
        id: 'test-project-id',
        name: 'Test Project',
        description: 'Test project description',
        owner: 'test-user-id',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        isPrivate: false,
        defaultBranch: 'main',
        starCount: 0,
        forkCount: 0,
    }),
}
