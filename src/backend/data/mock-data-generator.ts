/**
 * Mock Data Generator for RealLifeGit
 * Generates realistic mock data for development and testing
 */

import { 
    Project, 
    Commit, 
    Branch, 
    Task, 
    Issue, 
    PullRequest, 
    CommitAuthor, 
    TaskStatus, 
    TaskPriority, 
    IssueStatus, 
    IssuePriority, 
    PullRequestStatus, 
    ChangeType, 
    EdgeType,
    CommitEdge,
    ContributionData,
    UserActivity,
    ProjectStats
} from '@shared/types'

/**
 * Generate a random ID with prefix
 */
export function generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

/**
 * Generate a random commit hash
 */
export function generateCommitHash(): string {
    return Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

/**
 * Sample data pools for generation
 */
const SAMPLE_USERS: CommitAuthor[] = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane'
    },
    {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
    },
    {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
    },
    {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie'
    }
]

const SAMPLE_PROJECT_NAMES = [
    'Personal Productivity System',
    'Home Improvement Tracker',
    'Fitness Journey Planner',
    'Learning Goals Manager',
    'Creative Projects Hub',
    'Financial Planning Assistant',
    'Travel Adventure Organizer',
    'Recipe Collection Manager',
    'Garden Planning System',
    'Side Hustle Tracker'
]

const SAMPLE_TASK_TITLES = [
    'Complete morning workout routine',
    'Plan weekly meals and groceries',
    'Practice guitar for 30 minutes',
    'Read one chapter of current book',
    'Organize workspace and declutter',
    'Water indoor plants',
    'Practice meditation or mindfulness',
    'Write in journal for 10 minutes',
    'Review and update budget',
    'Call family or close friend',
    'Learn new skill for 1 hour',
    'Prepare healthy lunch',
    'Take a 20-minute walk',
    'Review daily goals and priorities',
    'Clean and organize one room'
]

const SAMPLE_TASK_DESCRIPTIONS = [
    'This task is part of establishing better daily routines',
    'Important for maintaining health and wellness goals',
    'Contributes to long-term personal development',
    'Helps maintain work-life balance',
    'Essential for achieving monthly objectives',
    'Supports overall productivity and organization',
    'Part of building positive habits and consistency',
    'Contributes to mental health and well-being'
]

const SAMPLE_COMMIT_MESSAGES = [
    'Add new task for daily routine',
    'Update task status and progress notes',
    'Reorganize task priorities',
    'Complete weekly review and planning',
    'Fix scheduling conflicts',
    'Add deadline reminders',
    'Update task descriptions with more details',
    'Mark tasks as completed',
    'Create new task category',
    'Merge weekly planning updates'
]

const SAMPLE_LABELS = [
    'urgent', 'health', 'fitness', 'learning', 'work', 'personal', 
    'routine', 'goals', 'planning', 'review', 'creative', 'social',
    'finance', 'home', 'travel', 'hobby', 'skill-building'
]

/**
 * Generate a random project
 */
export function generateProject(): Project {
    const id = generateId('proj')
    const name = SAMPLE_PROJECT_NAMES[Math.floor(Math.random() * SAMPLE_PROJECT_NAMES.length)]
    const owner = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    const createdAt = randomDate(new Date(2023, 0, 1), new Date())
    
    return {
        id,
        name,
        description: `A comprehensive system for managing ${name.toLowerCase()}`,
        owner: owner.email.split('@')[0],
        createdAt,
        updatedAt: randomDate(createdAt, new Date()),
        isPrivate: Math.random() > 0.7,
        defaultBranch: 'main',
        starCount: Math.floor(Math.random() * 50),
        forkCount: Math.floor(Math.random() * 10)
    }
}

/**
 * Generate a random task
 */
export function generateTask(projectId: string, branchId?: string): Task {
    const id = generateId('task')
    const title = SAMPLE_TASK_TITLES[Math.floor(Math.random() * SAMPLE_TASK_TITLES.length)]
    const description = SAMPLE_TASK_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_TASK_DESCRIPTIONS.length)]
    const createdAt = randomDate(new Date(2024, 0, 1), new Date())
    const assignee = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    
    const statuses = Object.values(TaskStatus)
    const priorities = Object.values(TaskPriority)
    
    // Generate random labels
    const numLabels = Math.floor(Math.random() * 4) + 1
    const labels = Array.from({ length: numLabels }, () => 
        SAMPLE_LABELS[Math.floor(Math.random() * SAMPLE_LABELS.length)]
    ).filter((label, index, arr) => arr.indexOf(label) === index)
    
    return {
        id,
        title,
        description,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        assignee: assignee.email.split('@')[0],
        createdAt,
        updatedAt: randomDate(createdAt, new Date()),
        dueDate: Math.random() > 0.3 ? randomDate(new Date(), new Date(2024, 11, 31)) : undefined,
        labels,
        metadata: {
            category: labels[0] || 'general',
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            timeEstimate: `${Math.floor(Math.random() * 120) + 15} minutes`
        },
        projectId,
        branchId
    }
}

/**
 * Generate a random commit
 */
export function generateCommit(
    branchName: string, 
    parentIds: string[] = [],
    existingTasks: Task[] = []
): Commit {
    const id = generateId('commit')
    const hash = generateCommitHash()
    const shortHash = hash.substring(0, 7)
    const message = SAMPLE_COMMIT_MESSAGES[Math.floor(Math.random() * SAMPLE_COMMIT_MESSAGES.length)]
    const author = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    const timestamp = randomDate(new Date(2024, 0, 1), new Date())
    
    // Generate task changes
    const numChanges = Math.floor(Math.random() * 3) + 1
    const changeTypes = Object.values(ChangeType)
    const changedTasks = Array.from({ length: numChanges }, (_, index) => {
        const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)]
        const task = existingTasks[Math.floor(Math.random() * existingTasks.length)] || generateTask('proj-1')
        
        return {
            taskId: task.id,
            changeType,
            oldValues: changeType === 'created' ? {} : { status: 'todo' },
            newValues: changeType === 'deleted' ? {} : { 
                status: 'in_progress',
                title: task.title 
            },
            notes: `${changeType} task via commit`
        }
    })
    
    return {
        id,
        hash,
        shortHash,
        message,
        author,
        timestamp,
        parentIds,
        branchName,
        changedTasks,
        stats: {
            tasksAdded: changedTasks.filter(t => t.changeType === 'created').length,
            tasksModified: changedTasks.filter(t => t.changeType === 'modified').length,
            tasksDeleted: changedTasks.filter(t => t.changeType === 'deleted').length,
            totalChanges: changedTasks.length
        }
    }
}

/**
 * Generate a random branch
 */
export function generateBranch(projectId: string, headCommitId: string): Branch {
    const id = generateId('branch')
    const branchNames = ['main', 'develop', 'feature/task-management', 'feature/ui-improvements', 'hotfix/urgent-fix']
    const name = branchNames[Math.floor(Math.random() * branchNames.length)]
    const createdAt = randomDate(new Date(2024, 0, 1), new Date())
    const author = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    
    return {
        id,
        name,
        projectId,
        headCommitId,
        createdAt,
        createdBy: author.email.split('@')[0],
        isDefault: name === 'main',
        isProtected: name === 'main',
        lastActivity: randomDate(createdAt, new Date())
    }
}

/**
 * Generate a random issue
 */
export function generateIssue(projectId: string): Issue {
    const id = generateId('issue')
    const number = Math.floor(Math.random() * 100) + 1
    const titles = [
        'Task scheduling conflicts need resolution',
        'Need better progress tracking',
        'Improve task categorization system',
        'Add deadline reminder notifications',
        'Export functionality for task reports',
        'Mobile app support needed',
        'Integration with calendar apps',
        'Bulk task operations support'
    ]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const author = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    const assignee = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    const createdAt = randomDate(new Date(2024, 0, 1), new Date())
    
    const statuses = Object.values(IssueStatus)
    const priorities = Object.values(IssuePriority)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
        id,
        number,
        title,
        description: `Detailed description for ${title.toLowerCase()}. This issue needs attention and proper resolution.`,
        status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        author: author.email.split('@')[0],
        assignee: assignee.email.split('@')[0],
        createdAt,
        updatedAt: randomDate(createdAt, new Date()),
        closedAt: status === 'closed' ? randomDate(createdAt, new Date()) : undefined,
        labels: SAMPLE_LABELS.slice(0, Math.floor(Math.random() * 3) + 1),
        comments: [],
        projectId
    }
}

/**
 * Generate a random pull request
 */
export function generatePullRequest(projectId: string): PullRequest {
    const id = generateId('pr')
    const number = Math.floor(Math.random() * 50) + 1
    const titles = [
        'Add new task management features',
        'Improve user interface responsiveness',
        'Fix bug in task scheduling',
        'Update documentation and examples',
        'Enhance performance optimization',
        'Add new reporting capabilities'
    ]
    const title = titles[Math.floor(Math.random() * titles.length)]
    const author = SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)]
    const createdAt = randomDate(new Date(2024, 0, 1), new Date())
    
    const statuses = Object.values(PullRequestStatus)
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    return {
        id,
        number,
        title,
        description: `## Summary\n\n${title}\n\n## Changes\n- Feature implementation\n- Test coverage\n- Documentation updates`,
        fromBranch: 'feature/enhancement',
        toBranch: 'main',
        status,
        author: author.email.split('@')[0],
        reviewers: SAMPLE_USERS.slice(0, 2).map(u => u.email.split('@')[0]),
        createdAt,
        updatedAt: randomDate(createdAt, new Date()),
        mergedAt: status === 'merged' ? randomDate(createdAt, new Date()) : undefined,
        closedAt: status === 'closed' ? randomDate(createdAt, new Date()) : undefined,
        conflicts: [],
        projectId
    }
}

/**
 * Generate commit edges for a linear history
 */
export function generateCommitEdges(commits: Commit[]): CommitEdge[] {
    const edges: CommitEdge[] = []
    
    for (let i = 1; i < commits.length; i++) {
        const parentCommit = commits[i - 1]
        const currentCommit = commits[i]
        
        edges.push({
            id: generateId('edge'),
            from: parentCommit.id,
            to: currentCommit.id,
            type: EdgeType.PARENT
        })
    }
    
    return edges
}

/**
 * Generate contribution data for a user
 */
export function generateContributionData(userId: string, days: number = 365): ContributionData[] {
    const contributions: ContributionData[] = []
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        
        const commitCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0
        const taskCount = Math.random() > 0.5 ? Math.floor(Math.random() * 8) : 0
        const intensity = Math.min(4, Math.floor((commitCount + taskCount) / 2))
        
        contributions.push({
            date,
            commitCount,
            taskCount,
            intensity
        })
    }
    
    return contributions
}

/**
 * Generate a complete project with all related data
 */
export function generateCompleteProject(): {
    project: Project
    branches: Branch[]
    commits: Commit[]
    tasks: Task[]
    issues: Issue[]
    pullRequests: PullRequest[]
    edges: CommitEdge[]
} {
    const project = generateProject()
    
    // Generate tasks first
    const tasks = Array.from({ length: 10 }, () => generateTask(project.id))
    
    // Generate commits
    const commits = Array.from({ length: 8 }, (_, index) => {
        const parentIds = index === 0 ? [] : [commits[index - 1]?.id].filter(Boolean)
        return generateCommit('main', parentIds, tasks)
    })
    
    // Generate branches
    const mainBranch = generateBranch(project.id, commits[commits.length - 1].id)
    mainBranch.name = 'main'
    mainBranch.isDefault = true
    mainBranch.isProtected = true
    
    const featureBranch = generateBranch(project.id, commits[commits.length - 2].id)
    featureBranch.name = 'feature/enhancements'
    
    const branches = [mainBranch, featureBranch]
    
    // Generate issues and pull requests
    const issues = Array.from({ length: 5 }, () => generateIssue(project.id))
    const pullRequests = Array.from({ length: 3 }, () => generatePullRequest(project.id))
    
    // Generate edges
    const edges = generateCommitEdges(commits)
    
    return {
        project,
        branches,
        commits,
        tasks,
        issues,
        pullRequests,
        edges
    }
}

/**
 * Utility function to generate mock data for testing
 */
export function generateMockDataSet(projectCount: number = 2) {
    const projects: Project[] = []
    const allBranches: Branch[] = []
    const allCommits: Commit[] = []
    const allTasks: Task[] = []
    const allIssues: Issue[] = []
    const allPullRequests: PullRequest[] = []
    const allEdges: CommitEdge[] = []
    
    for (let i = 0; i < projectCount; i++) {
        const projectData = generateCompleteProject()
        
        projects.push(projectData.project)
        allBranches.push(...projectData.branches)
        allCommits.push(...projectData.commits)
        allTasks.push(...projectData.tasks)
        allIssues.push(...projectData.issues)
        allPullRequests.push(...projectData.pullRequests)
        allEdges.push(...projectData.edges)
    }
    
    return {
        projects,
        branches: allBranches,
        commits: allCommits,
        tasks: allTasks,
        issues: allIssues,
        pullRequests: allPullRequests,
        edges: allEdges,
        users: SAMPLE_USERS
    }
}
