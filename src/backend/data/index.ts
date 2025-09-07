/**
 * Data Layer Index
 * Exports all data-related functionality for the backend
 */

// Core data store
export { dataStore, InMemoryDataStore } from './in-memory-store'
export type { QueryOptions, PaginatedResponse } from './in-memory-store'

// Mock data generation
export {
    generateId,
    randomDate,
    generateCommitHash,
    generateProject,
    generateTask,
    generateCommit,
    generateBranch,
    generateIssue,
    generatePullRequest,
    generateCommitEdges,
    generateContributionData,
    generateCompleteProject,
    generateMockDataSet
} from './mock-data-generator'

// Data validation
export {
    validateData,
    validateOrThrow,
    validateProject,
    validateTask,
    validateCommit,
    validateBranch,
    validateIssue,
    validatePullRequest,
    validateCreateCommitRequest,
    validateCreateBranchRequest,
    validateCreatePullRequestRequest,
    validators
} from './validation'
export type { ValidationResult } from './validation'

/**
 * Data layer initialization
 * Call this function to set up the data layer with mock data
 */
export async function initializeDataLayer(): Promise<void> {
    // The data store automatically initializes with mock data
    // This function is a placeholder for future database setup
    console.log('✅ Data layer initialized with mock data')
    
    const stats = await dataStore.getStoreStats()
    console.log('📊 Data store statistics:', stats)
}

/**
 * Health check for the data layer
 */
export async function checkDataLayerHealth(): Promise<{
    status: 'healthy' | 'unhealthy'
    details: Record<string, any>
}> {
    try {
        const stats = await dataStore.getStoreStats()
        const hasData = Object.values(stats).some(count => count > 0)
        
        return {
            status: hasData ? 'healthy' : 'unhealthy',
            details: {
                ...stats,
                timestamp: new Date().toISOString()
            }
        }
    } catch (error) {
        return {
            status: 'unhealthy',
            details: {
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }
        }
    }
}

/**
 * TODO: Future enhancements
 * 
 * Database Integration:
 * - Replace InMemoryDataStore with database repositories
 * - Add connection pooling and transaction support
 * - Implement database migrations and seeding
 * 
 * Caching Layer:
 * - Add Redis caching for frequently accessed data
 * - Implement cache invalidation strategies
 * - Add cache warming for critical data
 * 
 * Data Synchronization:
 * - Add real-time data sync with WebSockets
 * - Implement conflict resolution for concurrent edits
 * - Add optimistic locking for data consistency
 * 
 * Advanced Querying:
 * - Add full-text search capabilities
 * - Implement complex filtering and sorting
 * - Add aggregation and analytics queries
 * 
 * Data Import/Export:
 * - Add CSV/JSON import/export functionality
 * - Implement data backup and restore
 * - Add data migration tools
 */
