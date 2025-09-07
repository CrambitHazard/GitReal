/**
 * Core TypeScript interfaces for RealLifeGit
 * Shared between frontend and backend
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Represents a project/repository in the system
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  defaultBranch: string;
  starCount: number;
  forkCount: number;
}

/**
 * Represents a commit in the version control system
 * Supports multiple parents for merge commits
 */
export interface Commit {
  id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: CommitAuthor;
  timestamp: Date;
  parentIds: string[]; // Support for merge commits with multiple parents
  branchName: string;
  changedTasks: TaskChange[];
  stats: CommitStats;
}

/**
 * Author information for commits
 */
export interface CommitAuthor {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Statistics about a commit
 */
export interface CommitStats {
  tasksAdded: number;
  tasksModified: number;
  tasksDeleted: number;
  totalChanges: number;
}

/**
 * Represents a branch in the repository
 */
export interface Branch {
  id: string;
  name: string;
  projectId: string;
  headCommitId: string;
  createdAt: Date;
  createdBy: string;
  isDefault: boolean;
  isProtected: boolean;
  lastActivity: Date;
}

/**
 * Represents a task in the system
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  labels: string[];
  metadata: Record<string, any>;
  projectId: string;
  branchId?: string;
}

/**
 * Represents changes to a task in a commit
 */
export interface TaskChange {
  taskId: string;
  changeType: ChangeType;
  oldValues: Partial<Task>;
  newValues: Partial<Task>;
  notes?: string;
}

/**
 * Represents an issue in the project
 */
export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  author: string;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  labels: string[];
  comments: IssueComment[];
  projectId: string;
}

/**
 * Represents a comment on an issue
 */
export interface IssueComment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Represents a pull request
 */
export interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  fromBranch: string;
  toBranch: string;
  status: PullRequestStatus;
  author: string;
  reviewers: string[];
  createdAt: Date;
  updatedAt: Date;
  mergedAt?: Date;
  closedAt?: Date;
  mergeCommitId?: string;
  conflicts: ConflictInfo[];
  projectId: string;
}

/**
 * Represents merge conflict information
 */
export interface ConflictInfo {
  id: string;
  taskId: string;
  field: string;
  baseValue: any;
  incomingValue: any;
  currentValue: any;
  resolution?: ConflictResolution;
}

/**
 * Represents how a conflict was resolved
 */
export interface ConflictResolution {
  strategy: 'accept_incoming' | 'accept_current' | 'manual';
  resolvedValue: any;
  resolvedBy: string;
  resolvedAt: Date;
}

// ============================================================================
// GRAPH & VISUALIZATION
// ============================================================================

/**
 * Represents the complete project graph data
 */
export interface ProjectGraph {
  project: Project;
  commits: Commit[];
  branches: Branch[];
  edges: CommitEdge[];
  issues: Issue[];
  pullRequests: PullRequest[];
  tasks: Task[];
}

/**
 * Represents an edge between commits in the graph
 */
export interface CommitEdge {
  id: string;
  from: string; // parent commit id
  to: string;   // child commit id
  type: EdgeType;
}

/**
 * Position information for graph nodes
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Layout information for the commit graph
 */
export interface GraphLayout {
  nodes: Record<string, NodePosition>;
  width: number;
  height: number;
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

/**
 * Request to create a new commit
 */
export interface CreateCommitRequest {
  message: string;
  branchName: string;
  taskChanges: TaskChange[];
  author: CommitAuthor;
}

/**
 * Request to create a new branch
 */
export interface CreateBranchRequest {
  name: string;
  fromCommitId: string;
  description?: string;
}

/**
 * Request to create a new pull request
 */
export interface CreatePullRequestRequest {
  title: string;
  description: string;
  fromBranch: string;
  toBranch: string;
  reviewers?: string[];
}

// ============================================================================
// ENUMS
// ============================================================================

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  BLOCKED = 'blocked',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum ChangeType {
  CREATED = 'created',
  MODIFIED = 'modified',
  DELETED = 'deleted',
  MOVED = 'moved'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed'
}

export enum IssuePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum PullRequestStatus {
  OPEN = 'open',
  MERGED = 'merged',
  CLOSED = 'closed',
  DRAFT = 'draft'
}

export enum EdgeType {
  PARENT = 'parent',
  MERGE = 'merge',
  BRANCH = 'branch'
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Contribution data for heatmap
 */
export interface ContributionData {
  date: Date;
  commitCount: number;
  taskCount: number;
  intensity: number; // 0-4 scale for heatmap colors
}

/**
 * User activity summary
 */
export interface UserActivity {
  userId: string;
  totalCommits: number;
  totalTasks: number;
  streakDays: number;
  contributions: ContributionData[];
}

/**
 * Project statistics
 */
export interface ProjectStats {
  totalCommits: number;
  totalBranches: number;
  totalTasks: number;
  totalIssues: number;
  totalPullRequests: number;
  activeContributors: number;
  lastActivity: Date;
}

// ============================================================================
// TODO: Extensions for future features
// ============================================================================

/**
 * TODO: Authentication & Authorization
 * - User interface
 * - Role-based permissions
 * - OAuth integration
 */

/**
 * TODO: Real-time collaboration
 * - WebSocket message types
 * - Presence indicators
 * - Live cursor positions
 */

/**
 * TODO: Advanced diff/merge
 * - Three-way merge algorithms
 * - Conflict resolution strategies
 * - Automatic merge rules
 */

/**
 * TODO: Database persistence
 * - Entity relationships
 * - Migration schemas
 * - Indexing strategies
 */
