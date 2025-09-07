/**
 * Data Validation Schemas for RealLifeGit
 * Provides runtime validation for API requests and data integrity
 */

import { 
    Project, 
    Commit, 
    Branch, 
    Task, 
    Issue, 
    PullRequest,
    CreateCommitRequest,
    CreateBranchRequest,
    CreatePullRequestRequest,
    TaskStatus,
    TaskPriority,
    IssueStatus,
    IssuePriority,
    PullRequestStatus
} from '@shared/types'

/**
 * Validation result interface
 */
export interface ValidationResult {
    isValid: boolean
    errors: string[]
}

/**
 * Utility validation functions
 */
export const validators = {
    /**
     * Check if value is a non-empty string
     */
    isNonEmptyString: (value: any): boolean => {
        return typeof value === 'string' && value.trim().length > 0
    },

    /**
     * Check if value is a valid email
     */
    isEmail: (value: any): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return typeof value === 'string' && emailRegex.test(value)
    },

    /**
     * Check if value is a valid URL
     */
    isUrl: (value: any): boolean => {
        try {
            new URL(value)
            return true
        } catch {
            return false
        }
    },

    /**
     * Check if value is a valid date
     */
    isDate: (value: any): boolean => {
        return value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))
    },

    /**
     * Check if value is in enum
     */
    isInEnum: <T extends Record<string, string>>(value: any, enumObj: T): boolean => {
        return Object.values(enumObj).includes(value)
    },

    /**
     * Check if value is a valid UUID-like string
     */
    isValidId: (value: any): boolean => {
        return typeof value === 'string' && value.length > 0 && /^[a-zA-Z0-9\-_]+$/.test(value)
    },

    /**
     * Check if value is an array
     */
    isArray: (value: any): boolean => {
        return Array.isArray(value)
    },

    /**
     * Check if value is a positive number
     */
    isPositiveNumber: (value: any): boolean => {
        return typeof value === 'number' && value >= 0
    },

    /**
     * Check if value is a valid commit hash
     */
    isCommitHash: (value: any): boolean => {
        return typeof value === 'string' && /^[a-f0-9]{40}$/.test(value)
    },

    /**
     * Check if value is a valid short commit hash
     */
    isShortCommitHash: (value: any): boolean => {
        return typeof value === 'string' && /^[a-f0-9]{7}$/.test(value)
    }
}

/**
 * Validate Project data
 */
export function validateProject(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('Project ID must be a valid identifier')
    }

    if (!validators.isNonEmptyString(data.name)) {
        errors.push('Project name is required and must be non-empty')
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.push('Project description must be a string')
    }

    if (!validators.isNonEmptyString(data.owner)) {
        errors.push('Project owner is required')
    }

    if (!validators.isDate(data.createdAt)) {
        errors.push('Project createdAt must be a valid date')
    }

    if (!validators.isDate(data.updatedAt)) {
        errors.push('Project updatedAt must be a valid date')
    }

    if (typeof data.isPrivate !== 'boolean') {
        errors.push('Project isPrivate must be a boolean')
    }

    if (!validators.isNonEmptyString(data.defaultBranch)) {
        errors.push('Project defaultBranch is required')
    }

    if (!validators.isPositiveNumber(data.starCount)) {
        errors.push('Project starCount must be a positive number')
    }

    if (!validators.isPositiveNumber(data.forkCount)) {
        errors.push('Project forkCount must be a positive number')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate Task data
 */
export function validateTask(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('Task ID must be a valid identifier')
    }

    if (!validators.isNonEmptyString(data.title)) {
        errors.push('Task title is required and must be non-empty')
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.push('Task description must be a string')
    }

    if (!validators.isInEnum(data.status, TaskStatus)) {
        errors.push(`Task status must be one of: ${Object.values(TaskStatus).join(', ')}`)
    }

    if (!validators.isInEnum(data.priority, TaskPriority)) {
        errors.push(`Task priority must be one of: ${Object.values(TaskPriority).join(', ')}`)
    }

    if (data.assignee !== undefined && !validators.isNonEmptyString(data.assignee)) {
        errors.push('Task assignee must be a non-empty string if provided')
    }

    if (!validators.isDate(data.createdAt)) {
        errors.push('Task createdAt must be a valid date')
    }

    if (!validators.isDate(data.updatedAt)) {
        errors.push('Task updatedAt must be a valid date')
    }

    if (data.dueDate !== undefined && !validators.isDate(data.dueDate)) {
        errors.push('Task dueDate must be a valid date if provided')
    }

    if (!validators.isArray(data.labels)) {
        errors.push('Task labels must be an array')
    }

    if (typeof data.metadata !== 'object' || data.metadata === null) {
        errors.push('Task metadata must be an object')
    }

    if (!validators.isValidId(data.projectId)) {
        errors.push('Task projectId must be a valid identifier')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate Commit data
 */
export function validateCommit(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('Commit ID must be a valid identifier')
    }

    if (!validators.isCommitHash(data.hash)) {
        errors.push('Commit hash must be a valid 40-character hex string')
    }

    if (!validators.isShortCommitHash(data.shortHash)) {
        errors.push('Commit shortHash must be a valid 7-character hex string')
    }

    if (!validators.isNonEmptyString(data.message)) {
        errors.push('Commit message is required and must be non-empty')
    }

    if (!data.author || typeof data.author !== 'object') {
        errors.push('Commit author is required and must be an object')
    } else {
        if (!validators.isNonEmptyString(data.author.name)) {
            errors.push('Commit author name is required')
        }
        if (!validators.isEmail(data.author.email)) {
            errors.push('Commit author email must be valid')
        }
    }

    if (!validators.isDate(data.timestamp)) {
        errors.push('Commit timestamp must be a valid date')
    }

    if (!validators.isArray(data.parentIds)) {
        errors.push('Commit parentIds must be an array')
    }

    if (!validators.isNonEmptyString(data.branchName)) {
        errors.push('Commit branchName is required')
    }

    if (!validators.isArray(data.changedTasks)) {
        errors.push('Commit changedTasks must be an array')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate Branch data
 */
export function validateBranch(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('Branch ID must be a valid identifier')
    }

    if (!validators.isNonEmptyString(data.name)) {
        errors.push('Branch name is required and must be non-empty')
    }

    if (!validators.isValidId(data.projectId)) {
        errors.push('Branch projectId must be a valid identifier')
    }

    if (!validators.isValidId(data.headCommitId)) {
        errors.push('Branch headCommitId must be a valid identifier')
    }

    if (!validators.isDate(data.createdAt)) {
        errors.push('Branch createdAt must be a valid date')
    }

    if (!validators.isNonEmptyString(data.createdBy)) {
        errors.push('Branch createdBy is required')
    }

    if (typeof data.isDefault !== 'boolean') {
        errors.push('Branch isDefault must be a boolean')
    }

    if (typeof data.isProtected !== 'boolean') {
        errors.push('Branch isProtected must be a boolean')
    }

    if (!validators.isDate(data.lastActivity)) {
        errors.push('Branch lastActivity must be a valid date')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate Issue data
 */
export function validateIssue(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('Issue ID must be a valid identifier')
    }

    if (!validators.isPositiveNumber(data.number)) {
        errors.push('Issue number must be a positive number')
    }

    if (!validators.isNonEmptyString(data.title)) {
        errors.push('Issue title is required and must be non-empty')
    }

    if (!validators.isNonEmptyString(data.description)) {
        errors.push('Issue description is required and must be non-empty')
    }

    if (!validators.isInEnum(data.status, IssueStatus)) {
        errors.push(`Issue status must be one of: ${Object.values(IssueStatus).join(', ')}`)
    }

    if (!validators.isInEnum(data.priority, IssuePriority)) {
        errors.push(`Issue priority must be one of: ${Object.values(IssuePriority).join(', ')}`)
    }

    if (!validators.isNonEmptyString(data.author)) {
        errors.push('Issue author is required')
    }

    if (!validators.isValidId(data.projectId)) {
        errors.push('Issue projectId must be a valid identifier')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate PullRequest data
 */
export function validatePullRequest(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isValidId(data.id)) {
        errors.push('PullRequest ID must be a valid identifier')
    }

    if (!validators.isPositiveNumber(data.number)) {
        errors.push('PullRequest number must be a positive number')
    }

    if (!validators.isNonEmptyString(data.title)) {
        errors.push('PullRequest title is required and must be non-empty')
    }

    if (!validators.isNonEmptyString(data.fromBranch)) {
        errors.push('PullRequest fromBranch is required')
    }

    if (!validators.isNonEmptyString(data.toBranch)) {
        errors.push('PullRequest toBranch is required')
    }

    if (!validators.isInEnum(data.status, PullRequestStatus)) {
        errors.push(`PullRequest status must be one of: ${Object.values(PullRequestStatus).join(', ')}`)
    }

    if (!validators.isNonEmptyString(data.author)) {
        errors.push('PullRequest author is required')
    }

    if (!validators.isArray(data.reviewers)) {
        errors.push('PullRequest reviewers must be an array')
    }

    if (!validators.isValidId(data.projectId)) {
        errors.push('PullRequest projectId must be a valid identifier')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate CreateCommitRequest
 */
export function validateCreateCommitRequest(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isNonEmptyString(data.message)) {
        errors.push('Commit message is required and must be non-empty')
    }

    if (!validators.isNonEmptyString(data.branchName)) {
        errors.push('Branch name is required')
    }

    if (!validators.isArray(data.taskChanges)) {
        errors.push('Task changes must be an array')
    }

    if (!data.author || typeof data.author !== 'object') {
        errors.push('Author information is required')
    } else {
        if (!validators.isNonEmptyString(data.author.name)) {
            errors.push('Author name is required')
        }
        if (!validators.isEmail(data.author.email)) {
            errors.push('Author email must be valid')
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate CreateBranchRequest
 */
export function validateCreateBranchRequest(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isNonEmptyString(data.name)) {
        errors.push('Branch name is required and must be non-empty')
    }

    if (!validators.isValidId(data.fromCommitId)) {
        errors.push('From commit ID must be a valid identifier')
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        errors.push('Branch description must be a string if provided')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Validate CreatePullRequestRequest
 */
export function validateCreatePullRequestRequest(data: any): ValidationResult {
    const errors: string[] = []

    if (!validators.isNonEmptyString(data.title)) {
        errors.push('Pull request title is required and must be non-empty')
    }

    if (!validators.isNonEmptyString(data.description)) {
        errors.push('Pull request description is required and must be non-empty')
    }

    if (!validators.isNonEmptyString(data.fromBranch)) {
        errors.push('From branch is required')
    }

    if (!validators.isNonEmptyString(data.toBranch)) {
        errors.push('To branch is required')
    }

    if (data.reviewers !== undefined && !validators.isArray(data.reviewers)) {
        errors.push('Reviewers must be an array if provided')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * Master validation function that routes to specific validators
 */
export function validateData(dataType: string, data: any): ValidationResult {
    switch (dataType) {
        case 'project':
            return validateProject(data)
        case 'task':
            return validateTask(data)
        case 'commit':
            return validateCommit(data)
        case 'branch':
            return validateBranch(data)
        case 'issue':
            return validateIssue(data)
        case 'pullRequest':
            return validatePullRequest(data)
        case 'createCommitRequest':
            return validateCreateCommitRequest(data)
        case 'createBranchRequest':
            return validateCreateBranchRequest(data)
        case 'createPullRequestRequest':
            return validateCreatePullRequestRequest(data)
        default:
            return {
                isValid: false,
                errors: [`Unknown data type: ${dataType}`]
            }
    }
}

/**
 * Utility function to throw validation errors
 */
export function validateOrThrow(dataType: string, data: any): void {
    const result = validateData(dataType, data)
    if (!result.isValid) {
        throw new Error(`Validation failed for ${dataType}: ${result.errors.join(', ')}`)
    }
}

/**
 * TODO: Future enhancements
 * - Add Zod or Joi integration for more robust validation
 * - Add custom validation rules for business logic
 * - Add cross-field validation (e.g., due date after created date)
 * - Add async validation for database constraints
 * - Add sanitization functions for user inputs
 */
