/**
 * In-Memory Data Store for RealLifeGit
 * Provides CRUD operations for all entities with mock data
 * Easily extendable to use a real database later
 */

import {
    Project,
    Commit,
    Branch,
    Task,
    Issue,
    PullRequest,
    CommitEdge,
    ProjectGraph,
    ContributionData,
    UserActivity,
    ProjectStats,
    ApiResponse,
    CreateCommitRequest,
    CreateBranchRequest,
    CreatePullRequestRequest
} from '@shared/types'

import { generateId, generateCommitHash, generateCompleteProject } from './mock-data-generator'
import { validateOrThrow } from './validation'

// Import static mock data
import mockProjects from '../../../data/fixtures/mock-data.json'
import mockTasks from '../../../data/fixtures/tasks-data.json'
import mockIssues from '../../../data/fixtures/issues-data.json'
import mockPullRequests from '../../../data/fixtures/pull-requests-data.json'
import mockGraph from '../../../data/fixtures/graph-data.json'

/**
 * Query options for filtering and pagination
 */
export interface QueryOptions {
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    filters?: Record<string, any>
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        total: number
        limit: number
        offset: number
        hasNext: boolean
        hasPrev: boolean
    }
}

/**
 * In-memory data store class
 */
export class InMemoryDataStore {
    private projects: Map<string, Project> = new Map()
    private commits: Map<string, Commit> = new Map()
    private branches: Map<string, Branch> = new Map()
    private tasks: Map<string, Task> = new Map()
    private issues: Map<string, Issue> = new Map()
    private pullRequests: Map<string, PullRequest> = new Map()
    private commitEdges: Map<string, CommitEdge> = new Map()
    private initialized = false

    constructor() {
        this.initializeWithMockData()
    }

    /**
     * Initialize the store with mock data
     */
    private initializeWithMockData(): void {
        if (this.initialized) return

        // Load projects
        mockProjects.projects.forEach(project => {
            this.projects.set(project.id, {
                ...project,
                createdAt: new Date(project.createdAt),
                updatedAt: new Date(project.updatedAt)
            })
        })

        // Load commits
        mockProjects.commits.forEach(commit => {
            this.commits.set(commit.id, {
                ...commit,
                timestamp: new Date(commit.timestamp)
            })
        })

        // Load branches
        mockProjects.branches.forEach(branch => {
            this.branches.set(branch.id, {
                ...branch,
                createdAt: new Date(branch.createdAt),
                lastActivity: new Date(branch.lastActivity)
            })
        })

        // Load tasks
        mockTasks.tasks.forEach(task => {
            this.tasks.set(task.id, {
                ...task,
                createdAt: new Date(task.createdAt),
                updatedAt: new Date(task.updatedAt),
                dueDate: task.dueDate ? new Date(task.dueDate) : undefined
            })
        })

        // Load issues
        mockIssues.issues.forEach(issue => {
            this.issues.set(issue.id, {
                ...issue,
                createdAt: new Date(issue.createdAt),
                updatedAt: new Date(issue.updatedAt),
                closedAt: issue.closedAt ? new Date(issue.closedAt) : undefined,
                comments: issue.comments.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined
                }))
            })
        })

        // Load pull requests
        mockPullRequests.pullRequests.forEach(pr => {
            this.pullRequests.set(pr.id, {
                ...pr,
                createdAt: new Date(pr.createdAt),
                updatedAt: new Date(pr.updatedAt),
                mergedAt: pr.mergedAt ? new Date(pr.mergedAt) : undefined,
                closedAt: pr.closedAt ? new Date(pr.closedAt) : undefined
            })
        })

        // Load commit edges
        mockGraph.edges.forEach(edge => {
            this.commitEdges.set(edge.id, edge)
        })

        this.initialized = true
    }

    // ========================================================================
    // PROJECT OPERATIONS
    // ========================================================================

    /**
     * Get all projects with optional filtering and pagination
     */
    async getProjects(options: QueryOptions = {}): Promise<PaginatedResponse<Project>> {
        const { limit = 50, offset = 0, filters = {} } = options
        let projects = Array.from(this.projects.values())

        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase()
            projects = projects.filter(project =>
                project.name.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm)
            )
        }

        if (filters.owner) {
            projects = projects.filter(project => project.owner === filters.owner)
        }

        if (filters.isPrivate !== undefined) {
            projects = projects.filter(project => project.isPrivate === filters.isPrivate)
        }

        // Sort by updatedAt desc by default
        projects.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

        const total = projects.length
        const paginatedProjects = projects.slice(offset, offset + limit)

        return {
            data: paginatedProjects,
            pagination: {
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0
            }
        }
    }

    /**
     * Get a project by ID
     */
    async getProject(id: string): Promise<Project | null> {
        return this.projects.get(id) || null
    }

    /**
     * Create a new project
     */
    async createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
        const id = generateId('proj')
        const now = new Date()
        
        const project: Project = {
            ...projectData,
            id,
            createdAt: now,
            updatedAt: now
        }

        validateOrThrow('project', project)
        this.projects.set(id, project)

        return project
    }

    /**
     * Update a project
     */
    async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
        const project = this.projects.get(id)
        if (!project) return null

        const updatedProject = {
            ...project,
            ...updates,
            id, // Ensure ID cannot be changed
            updatedAt: new Date()
        }

        validateOrThrow('project', updatedProject)
        this.projects.set(id, updatedProject)

        return updatedProject
    }

    /**
     * Delete a project
     */
    async deleteProject(id: string): Promise<boolean> {
        return this.projects.delete(id)
    }

    /**
     * Get complete project graph data
     */
    async getProjectGraph(projectId: string): Promise<ProjectGraph | null> {
        const project = await this.getProject(projectId)
        if (!project) return null

        const projectCommits = Array.from(this.commits.values())
            .filter(commit => {
                // Find commits belonging to this project through branch association
                const projectBranches = Array.from(this.branches.values())
                    .filter(branch => branch.projectId === projectId)
                    .map(branch => branch.name)
                return projectBranches.includes(commit.branchName)
            })

        const projectBranches = Array.from(this.branches.values())
            .filter(branch => branch.projectId === projectId)

        const projectTasks = Array.from(this.tasks.values())
            .filter(task => task.projectId === projectId)

        const projectIssues = Array.from(this.issues.values())
            .filter(issue => issue.projectId === projectId)

        const projectPullRequests = Array.from(this.pullRequests.values())
            .filter(pr => pr.projectId === projectId)

        const projectEdges = Array.from(this.commitEdges.values())
            .filter(edge => {
                const fromCommit = this.commits.get(edge.from)
                const toCommit = this.commits.get(edge.to)
                return fromCommit && toCommit && 
                       projectCommits.some(c => c.id === fromCommit.id) &&
                       projectCommits.some(c => c.id === toCommit.id)
            })

        return {
            project,
            commits: projectCommits,
            branches: projectBranches,
            edges: projectEdges,
            issues: projectIssues,
            pullRequests: projectPullRequests,
            tasks: projectTasks
        }
    }

    // ========================================================================
    // COMMIT OPERATIONS
    // ========================================================================

    /**
     * Get commits for a project
     */
    async getCommits(projectId: string, options: QueryOptions = {}): Promise<PaginatedResponse<Commit>> {
        const { limit = 50, offset = 0, filters = {} } = options
        
        // Get project branches to filter commits
        const projectBranches = Array.from(this.branches.values())
            .filter(branch => branch.projectId === projectId)
            .map(branch => branch.name)

        let commits = Array.from(this.commits.values())
            .filter(commit => projectBranches.includes(commit.branchName))

        // Apply filters
        if (filters.branch) {
            commits = commits.filter(commit => commit.branchName === filters.branch)
        }

        if (filters.author) {
            commits = commits.filter(commit => 
                commit.author.email.includes(filters.author) || 
                commit.author.name.includes(filters.author)
            )
        }

        // Sort by timestamp desc
        commits.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

        const total = commits.length
        const paginatedCommits = commits.slice(offset, offset + limit)

        return {
            data: paginatedCommits,
            pagination: {
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0
            }
        }
    }

    /**
     * Get a commit by ID
     */
    async getCommit(id: string): Promise<Commit | null> {
        return this.commits.get(id) || null
    }

    /**
     * Create a new commit
     */
    async createCommit(projectId: string, commitData: CreateCommitRequest): Promise<Commit> {
        validateOrThrow('createCommitRequest', commitData)

        const id = generateId('commit')
        const hash = generateCommitHash()
        const shortHash = hash.substring(0, 7)
        const timestamp = new Date()

        // Find the head commit of the target branch to set as parent
        const targetBranch = Array.from(this.branches.values())
            .find(branch => branch.projectId === projectId && branch.name === commitData.branchName)

        const parentIds = targetBranch ? [targetBranch.headCommitId] : []

        const commit: Commit = {
            id,
            hash,
            shortHash,
            message: commitData.message,
            author: commitData.author,
            timestamp,
            parentIds,
            branchName: commitData.branchName,
            changedTasks: commitData.taskChanges,
            stats: {
                tasksAdded: commitData.taskChanges.filter(t => t.changeType === 'created').length,
                tasksModified: commitData.taskChanges.filter(t => t.changeType === 'modified').length,
                tasksDeleted: commitData.taskChanges.filter(t => t.changeType === 'deleted').length,
                totalChanges: commitData.taskChanges.length
            }
        }

        this.commits.set(id, commit)

        // Update the branch head commit
        if (targetBranch) {
            await this.updateBranch(targetBranch.id, { 
                headCommitId: id,
                lastActivity: timestamp
            })
        }

        return commit
    }

    // ========================================================================
    // BRANCH OPERATIONS
    // ========================================================================

    /**
     * Get branches for a project
     */
    async getBranches(projectId: string): Promise<Branch[]> {
        return Array.from(this.branches.values())
            .filter(branch => branch.projectId === projectId)
            .sort((a, b) => {
                // Default branch first, then by last activity
                if (a.isDefault && !b.isDefault) return -1
                if (!a.isDefault && b.isDefault) return 1
                return b.lastActivity.getTime() - a.lastActivity.getTime()
            })
    }

    /**
     * Get a branch by ID
     */
    async getBranch(id: string): Promise<Branch | null> {
        return this.branches.get(id) || null
    }

    /**
     * Create a new branch
     */
    async createBranch(projectId: string, branchData: CreateBranchRequest): Promise<Branch> {
        validateOrThrow('createBranchRequest', branchData)

        const id = generateId('branch')
        const now = new Date()

        const branch: Branch = {
            id,
            name: branchData.name,
            projectId,
            headCommitId: branchData.fromCommitId,
            createdAt: now,
            createdBy: 'current-user', // TODO: Get from auth context
            isDefault: false,
            isProtected: false,
            lastActivity: now
        }

        validateOrThrow('branch', branch)
        this.branches.set(id, branch)

        return branch
    }

    /**
     * Update a branch
     */
    async updateBranch(id: string, updates: Partial<Branch>): Promise<Branch | null> {
        const branch = this.branches.get(id)
        if (!branch) return null

        const updatedBranch = {
            ...branch,
            ...updates,
            id // Ensure ID cannot be changed
        }

        validateOrThrow('branch', updatedBranch)
        this.branches.set(id, updatedBranch)

        return updatedBranch
    }

    // ========================================================================
    // TASK OPERATIONS
    // ========================================================================

    /**
     * Get tasks for a project
     */
    async getTasks(projectId: string, options: QueryOptions = {}): Promise<PaginatedResponse<Task>> {
        const { limit = 50, offset = 0, filters = {} } = options
        let tasks = Array.from(this.tasks.values())
            .filter(task => task.projectId === projectId)

        // Apply filters
        if (filters.status) {
            tasks = tasks.filter(task => task.status === filters.status)
        }

        if (filters.assignee) {
            tasks = tasks.filter(task => task.assignee === filters.assignee)
        }

        if (filters.priority) {
            tasks = tasks.filter(task => task.priority === filters.priority)
        }

        // Sort by updatedAt desc
        tasks.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

        const total = tasks.length
        const paginatedTasks = tasks.slice(offset, offset + limit)

        return {
            data: paginatedTasks,
            pagination: {
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0
            }
        }
    }

    /**
     * Get a task by ID
     */
    async getTask(id: string): Promise<Task | null> {
        return this.tasks.get(id) || null
    }

    // ========================================================================
    // ISSUE OPERATIONS
    // ========================================================================

    /**
     * Get issues for a project
     */
    async getIssues(projectId: string, options: QueryOptions = {}): Promise<PaginatedResponse<Issue>> {
        const { limit = 50, offset = 0, filters = {} } = options
        let issues = Array.from(this.issues.values())
            .filter(issue => issue.projectId === projectId)

        // Apply filters
        if (filters.status) {
            issues = issues.filter(issue => issue.status === filters.status)
        }

        if (filters.assignee) {
            issues = issues.filter(issue => issue.assignee === filters.assignee)
        }

        if (filters.priority) {
            issues = issues.filter(issue => issue.priority === filters.priority)
        }

        // Sort by updatedAt desc
        issues.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

        const total = issues.length
        const paginatedIssues = issues.slice(offset, offset + limit)

        return {
            data: paginatedIssues,
            pagination: {
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0
            }
        }
    }

    /**
     * Get an issue by ID
     */
    async getIssue(id: string): Promise<Issue | null> {
        return this.issues.get(id) || null
    }

    // ========================================================================
    // PULL REQUEST OPERATIONS
    // ========================================================================

    /**
     * Get pull requests for a project
     */
    async getPullRequests(projectId: string, options: QueryOptions = {}): Promise<PaginatedResponse<PullRequest>> {
        const { limit = 50, offset = 0, filters = {} } = options
        let pullRequests = Array.from(this.pullRequests.values())
            .filter(pr => pr.projectId === projectId)

        // Apply filters
        if (filters.status) {
            pullRequests = pullRequests.filter(pr => pr.status === filters.status)
        }

        if (filters.author) {
            pullRequests = pullRequests.filter(pr => pr.author === filters.author)
        }

        // Sort by updatedAt desc
        pullRequests.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

        const total = pullRequests.length
        const paginatedPRs = pullRequests.slice(offset, offset + limit)

        return {
            data: paginatedPRs,
            pagination: {
                total,
                limit,
                offset,
                hasNext: offset + limit < total,
                hasPrev: offset > 0
            }
        }
    }

    /**
     * Get a pull request by ID
     */
    async getPullRequest(id: string): Promise<PullRequest | null> {
        return this.pullRequests.get(id) || null
    }

    /**
     * Create a new pull request
     */
    async createPullRequest(projectId: string, prData: CreatePullRequestRequest): Promise<PullRequest> {
        validateOrThrow('createPullRequestRequest', prData)

        const id = generateId('pr')
        const number = Array.from(this.pullRequests.values())
            .filter(pr => pr.projectId === projectId)
            .length + 1

        const pullRequest: PullRequest = {
            id,
            number,
            title: prData.title,
            description: prData.description,
            fromBranch: prData.fromBranch,
            toBranch: prData.toBranch,
            status: 'open',
            author: 'current-user', // TODO: Get from auth context
            reviewers: prData.reviewers || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            conflicts: [],
            projectId
        }

        validateOrThrow('pullRequest', pullRequest)
        this.pullRequests.set(id, pullRequest)

        return pullRequest
    }

    // ========================================================================
    // ANALYTICS & STATISTICS
    // ========================================================================

    /**
     * Get project statistics
     */
    async getProjectStats(projectId: string): Promise<ProjectStats> {
        const projectCommits = Array.from(this.commits.values())
            .filter(commit => {
                const projectBranches = Array.from(this.branches.values())
                    .filter(branch => branch.projectId === projectId)
                    .map(branch => branch.name)
                return projectBranches.includes(commit.branchName)
            })

        const projectBranches = Array.from(this.branches.values())
            .filter(branch => branch.projectId === projectId)

        const projectTasks = Array.from(this.tasks.values())
            .filter(task => task.projectId === projectId)

        const projectIssues = Array.from(this.issues.values())
            .filter(issue => issue.projectId === projectId)

        const projectPullRequests = Array.from(this.pullRequests.values())
            .filter(pr => pr.projectId === projectId)

        const contributors = new Set(projectCommits.map(commit => commit.author.email))

        const lastActivity = Math.max(
            ...projectCommits.map(c => c.timestamp.getTime()),
            ...projectBranches.map(b => b.lastActivity.getTime())
        )

        return {
            totalCommits: projectCommits.length,
            totalBranches: projectBranches.length,
            totalTasks: projectTasks.length,
            totalIssues: projectIssues.length,
            totalPullRequests: projectPullRequests.length,
            activeContributors: contributors.size,
            lastActivity: new Date(lastActivity)
        }
    }

    /**
     * Get contribution data
     */
    async getContributionData(projectId: string, userId?: string): Promise<{
        contributions: ContributionData[]
        userActivity: Record<string, UserActivity>
    }> {
        // For now, return mock data from fixtures
        // TODO: Calculate real contribution data from commits and tasks
        return {
            contributions: mockGraph.contributionData.map(contrib => ({
                ...contrib,
                date: new Date(contrib.date)
            })),
            userActivity: mockGraph.userActivity
        }
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================

    /**
     * Clear all data (useful for testing)
     */
    async clearAll(): Promise<void> {
        this.projects.clear()
        this.commits.clear()
        this.branches.clear()
        this.tasks.clear()
        this.issues.clear()
        this.pullRequests.clear()
        this.commitEdges.clear()
        this.initialized = false
    }

    /**
     * Reset to initial mock data
     */
    async reset(): Promise<void> {
        await this.clearAll()
        this.initializeWithMockData()
    }

    /**
     * Get store statistics
     */
    async getStoreStats(): Promise<{
        projects: number
        commits: number
        branches: number
        tasks: number
        issues: number
        pullRequests: number
        edges: number
    }> {
        return {
            projects: this.projects.size,
            commits: this.commits.size,
            branches: this.branches.size,
            tasks: this.tasks.size,
            issues: this.issues.size,
            pullRequests: this.pullRequests.size,
            edges: this.commitEdges.size
        }
    }
}

// Export singleton instance
export const dataStore = new InMemoryDataStore()
