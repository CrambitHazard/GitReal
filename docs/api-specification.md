# RealLifeGit API Specification

## 📋 Overview

The RealLifeGit API is a RESTful service that provides endpoints for managing projects, commits, branches, tasks, issues, and pull requests in a Git-like version control system for real-life tasks.

## 🌐 Base URL

```
Development: http://localhost:3000/api
Production: https://api.reallifegit.com/api
```

## 🔒 Authentication

**Current Implementation**: No authentication (MVP)
**Future Implementation**: JWT-based authentication with Bearer tokens

```http
Authorization: Bearer <jwt-token>
```

## 📨 Response Format

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: Date
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation failed: Project name is required",
  "message": "Bad Request",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📊 HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data or parameters
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate name)
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server errors

---

## 🗂️ Projects

### GET /projects
Get all projects for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of projects to return (default: 50, max: 100)
- `offset` (optional): Number of projects to skip (default: 0)
- `search` (optional): Search term for project name or description

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj-1",
        "name": "Personal Task Manager",
        "description": "A comprehensive task management system",
        "owner": "john-doe",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "isPrivate": false,
        "defaultBranch": "main",
        "starCount": 12,
        "forkCount": 3
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "offset": 0,
      "hasNext": false
    }
  }
}
```

### GET /projects/:id
Get a specific project by ID.

**Path Parameters:**
- `id`: Project identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "proj-1",
    "name": "Personal Task Manager",
    "description": "A comprehensive task management system",
    "owner": "john-doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "isPrivate": false,
    "defaultBranch": "main",
    "starCount": 12,
    "forkCount": 3
  }
}
```

### GET /projects/:id/graph
Get complete project graph data including commits, branches, edges, issues, PRs, and tasks.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `branch` (optional): Filter commits by branch name
- `limit` (optional): Limit number of commits (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "project": { ... },
    "commits": [ ... ],
    "branches": [ ... ],
    "edges": [ ... ],
    "issues": [ ... ],
    "pullRequests": [ ... ],
    "tasks": [ ... ]
  }
}
```

### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Project description",
  "isPrivate": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "proj-new",
    "name": "My New Project",
    "description": "Project description",
    "owner": "current-user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "isPrivate": false,
    "defaultBranch": "main",
    "starCount": 0,
    "forkCount": 0
  }
}
```

---

## 📝 Commits

### GET /projects/:id/commits
Get commits for a project.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `branch` (optional): Filter by branch name
- `limit` (optional): Number of commits (default: 50, max: 100)
- `offset` (optional): Skip commits (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "commits": [
      {
        "id": "commit-1",
        "hash": "a1b2c3d4e5f6789012345678901234567890abcd",
        "shortHash": "a1b2c3d",
        "message": "Initial project setup",
        "author": {
          "name": "John Doe",
          "email": "john@example.com",
          "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
        },
        "timestamp": "2024-01-01T00:00:00.000Z",
        "parentIds": [],
        "branchName": "main",
        "changedTasks": [ ... ],
        "stats": {
          "tasksAdded": 1,
          "tasksModified": 0,
          "tasksDeleted": 0,
          "totalChanges": 1
        }
      }
    ]
  }
}
```

### GET /projects/:id/commits/:commitId
Get a specific commit by ID.

**Path Parameters:**
- `id`: Project identifier
- `commitId`: Commit identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "commit-1",
    "hash": "a1b2c3d4e5f6789012345678901234567890abcd",
    "shortHash": "a1b2c3d",
    "message": "Initial project setup",
    "author": { ... },
    "timestamp": "2024-01-01T00:00:00.000Z",
    "parentIds": [],
    "branchName": "main",
    "changedTasks": [ ... ],
    "stats": { ... }
  }
}
```

### POST /projects/:id/commits
Create a new commit.

**Path Parameters:**
- `id`: Project identifier

**Request Body:**
```json
{
  "message": "Add new task for daily routine",
  "branchName": "main",
  "taskChanges": [
    {
      "taskId": "task-1",
      "changeType": "created",
      "oldValues": {},
      "newValues": {
        "title": "Morning workout",
        "status": "todo",
        "priority": "high"
      },
      "notes": "Added new fitness task"
    }
  ],
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "commit-new",
    "hash": "b2c3d4e5f6789012345678901234567890abcdef",
    "shortHash": "b2c3d4e",
    "message": "Add new task for daily routine",
    "author": { ... },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "parentIds": ["commit-5"],
    "branchName": "main",
    "changedTasks": [ ... ],
    "stats": { ... }
  }
}
```

---

## 🌿 Branches

### GET /projects/:id/branches
Get all branches for a project.

**Path Parameters:**
- `id`: Project identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "id": "branch-1",
        "name": "main",
        "projectId": "proj-1",
        "headCommitId": "commit-5",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "createdBy": "john-doe",
        "isDefault": true,
        "isProtected": true,
        "lastActivity": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### POST /projects/:id/branches
Create a new branch.

**Path Parameters:**
- `id`: Project identifier

**Request Body:**
```json
{
  "name": "feature/new-functionality",
  "fromCommitId": "commit-5",
  "description": "Adding new task management features"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "branch-new",
    "name": "feature/new-functionality",
    "projectId": "proj-1",
    "headCommitId": "commit-5",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "createdBy": "current-user",
    "isDefault": false,
    "isProtected": false,
    "lastActivity": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ✅ Tasks

### GET /projects/:id/tasks
Get all tasks for a project.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `status` (optional): Filter by task status
- `assignee` (optional): Filter by assignee
- `priority` (optional): Filter by priority
- `limit` (optional): Number of tasks (default: 50)
- `offset` (optional): Skip tasks (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-1",
        "title": "Set up morning routine",
        "description": "Establish a consistent morning routine",
        "status": "in_progress",
        "priority": "medium",
        "assignee": "john-doe",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-03T18:15:00.000Z",
        "dueDate": "2024-01-07T00:00:00.000Z",
        "labels": ["routine", "self-care"],
        "metadata": { ... },
        "projectId": "proj-1",
        "branchId": "branch-1"
      }
    ]
  }
}
```

### GET /projects/:id/tasks/:taskId
Get a specific task by ID.

**Path Parameters:**
- `id`: Project identifier
- `taskId`: Task identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-1",
    "title": "Set up morning routine",
    "description": "Establish a consistent morning routine",
    "status": "in_progress",
    "priority": "medium",
    "assignee": "john-doe",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-03T18:15:00.000Z",
    "dueDate": "2024-01-07T00:00:00.000Z",
    "labels": ["routine", "self-care"],
    "metadata": { ... },
    "projectId": "proj-1",
    "branchId": "branch-1"
  }
}
```

---

## 🐛 Issues

### GET /projects/:id/issues
Get all issues for a project.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `status` (optional): Filter by issue status (open, closed, in_progress)
- `assignee` (optional): Filter by assignee
- `priority` (optional): Filter by priority
- `labels` (optional): Comma-separated list of labels

**Response:**
```json
{
  "success": true,
  "data": {
    "issues": [
      {
        "id": "issue-1",
        "number": 1,
        "title": "Morning routine conflicts with workout schedule",
        "description": "The current morning routine timing conflicts...",
        "status": "open",
        "priority": "medium",
        "author": "john-doe",
        "assignee": "john-doe",
        "createdAt": "2024-01-04T09:15:00.000Z",
        "updatedAt": "2024-01-05T14:30:00.000Z",
        "labels": ["routine", "scheduling", "conflict"],
        "comments": [ ... ],
        "projectId": "proj-1"
      }
    ]
  }
}
```

### POST /projects/:id/issues
Create a new issue.

**Path Parameters:**
- `id`: Project identifier

**Request Body:**
```json
{
  "title": "Task scheduling conflicts",
  "description": "Detailed description of the issue...",
  "priority": "medium",
  "assignee": "john-doe",
  "labels": ["bug", "scheduling"]
}
```

---

## 🔄 Pull Requests

### GET /projects/:id/pulls
Get all pull requests for a project.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `status` (optional): Filter by PR status (open, merged, closed, draft)
- `author` (optional): Filter by author
- `reviewer` (optional): Filter by reviewer

**Response:**
```json
{
  "success": true,
  "data": {
    "pullRequests": [
      {
        "id": "pr-1",
        "number": 1,
        "title": "Add weekly planning and review system",
        "description": "This PR introduces a comprehensive weekly planning system...",
        "fromBranch": "feature/weekly-planning",
        "toBranch": "main",
        "status": "merged",
        "author": "jane-smith",
        "reviewers": ["john-doe", "bob-wilson"],
        "createdAt": "2024-01-14T15:00:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z",
        "mergedAt": "2024-01-15T10:30:00.000Z",
        "mergeCommitId": "commit-5",
        "conflicts": [],
        "projectId": "proj-1"
      }
    ]
  }
}
```

### POST /projects/:id/pulls
Create a new pull request.

**Path Parameters:**
- `id`: Project identifier

**Request Body:**
```json
{
  "title": "Add new feature implementation",
  "description": "## Summary\n\nImplementing new feature...",
  "fromBranch": "feature/new-feature",
  "toBranch": "main",
  "reviewers": ["john-doe", "jane-smith"]
}
```

---

## 📊 Analytics & Statistics

### GET /projects/:id/stats
Get project statistics.

**Path Parameters:**
- `id`: Project identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCommits": 15,
    "totalBranches": 3,
    "totalTasks": 25,
    "totalIssues": 8,
    "totalPullRequests": 5,
    "activeContributors": 3,
    "lastActivity": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /projects/:id/contributions
Get contribution data for heatmap visualization.

**Path Parameters:**
- `id`: Project identifier

**Query Parameters:**
- `user` (optional): Filter by user
- `days` (optional): Number of days (default: 365)

**Response:**
```json
{
  "success": true,
  "data": {
    "contributions": [
      {
        "date": "2024-01-01T00:00:00.000Z",
        "commitCount": 1,
        "taskCount": 1,
        "intensity": 1
      }
    ],
    "userActivity": {
      "john-doe": {
        "userId": "john-doe",
        "totalCommits": 4,
        "totalTasks": 7,
        "streakDays": 3,
        "contributions": [ ... ]
      }
    }
  }
}
```

---

## 🔍 Search

### GET /search
Global search across projects, tasks, issues, and PRs.

**Query Parameters:**
- `q`: Search query (required)
- `type` (optional): Filter by type (projects, tasks, issues, pulls)
- `project` (optional): Limit search to specific project
- `limit` (optional): Number of results (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "task",
        "id": "task-1",
        "title": "Set up morning routine",
        "description": "Establish a consistent morning routine",
        "projectId": "proj-1",
        "projectName": "Personal Task Manager",
        "score": 0.95
      }
    ],
    "totalResults": 15,
    "searchTime": "0.045s"
  }
}
```

---

## 🔧 Utility Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": "2h 45m 30s",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /version
API version information.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "apiVersion": "v1",
    "buildDate": "2024-01-15T00:00:00.000Z",
    "gitCommit": "a1b2c3d"
  }
}
```

---

## 📝 Error Handling

### Validation Errors (422)
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Unprocessable Entity",
  "details": [
    {
      "field": "title",
      "message": "Title is required and must be non-empty"
    },
    {
      "field": "priority",
      "message": "Priority must be one of: low, medium, high, urgent"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "error": "Project not found",
  "message": "Not Found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Server Errors (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 📚 Rate Limiting

**Current Implementation**: No rate limiting (MVP)
**Future Implementation**: 
- 100 requests per minute per IP for anonymous users
- 1000 requests per minute per authenticated user
- 10,000 requests per minute for premium users

**Headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642234567
```

---

## 🔮 Future API Features

### Webhooks
- Project events (commits, PRs, issues)
- Configurable webhook endpoints
- Event filtering and retry logic

### Real-time API
- WebSocket endpoints for live updates
- Presence indicators
- Live collaboration features

### Advanced Search
- Full-text search with Elasticsearch
- Faceted search and filtering
- Search suggestions and autocomplete

### API Versioning
- Versioned endpoints (/api/v1/, /api/v2/)
- Backward compatibility guarantees
- Deprecation notices and migration guides

---

**API Documentation Version**: 1.0.0  
**Last Updated**: January 15, 2024  
**Contact**: api@reallifegit.com
