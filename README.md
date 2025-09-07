# RealLifeGit 🚀

A GitHub-style version control system for real-life tasks, featuring interactive commit graphs, task management, and collaborative workflows.

## ✨ Features

- **Interactive Commit Graph**: Visualize task changes with React Flow and Dagre layout
- **Task Management**: Kanban-style boards with todo/in-progress/done states
- **Branch Management**: Create and manage branches for different workstreams
- **Pull Requests**: Collaborative workflow with review and merge capabilities
- **Issue Tracking**: Track bugs, features, and tasks with status management
- **Merge Conflict Resolution**: Visual diff viewer for resolving conflicts
- **Contribution Heatmap**: Track user activity and streak patterns
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Vite** for fast development and building
- **shadcn/ui** for consistent, accessible components
- **Tailwind CSS** for utility-first styling
- **React Flow** for interactive graph visualization
- **Zustand** for state management
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **In-memory storage** (easily extendable to databases)
- **CORS** and security middleware

### Development
- **ESLint + Prettier** for code quality
- **Jest** for testing
- **GitHub Actions** for CI/CD
- **Docker** for containerization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GitReal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This runs both frontend (http://localhost:5173) and backend (http://localhost:3000) concurrently.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only the frontend development server
- `npm run dev:backend` - Start only the backend development server
- `npm run build` - Build both frontend and backend for production
- `npm run test` - Run the test suite
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
GitReal/
├── src/
│   ├── frontend/           # React application
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # Frontend-specific types
│   │   └── utils/         # Utility functions
│   ├── backend/           # Express API server
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── types/         # Backend-specific types
│   │   └── data/          # Data layer and mock data
│   └── shared/            # Shared code
│       └── types/         # Common TypeScript interfaces
├── data/fixtures/         # Mock data for development
├── tests/                 # Test suites
├── docs/                  # Documentation
└── architecture/          # Architecture documentation
```

## 🎯 Core Concepts

### Projects
Each project represents a repository of tasks with:
- Commit history tracking changes
- Multiple branches for different workstreams
- Issues for bug tracking and feature requests
- Pull requests for collaborative reviews

### Commits
Track changes to tasks with:
- Message describing the change
- Author information and timestamp
- List of modified tasks with before/after states
- Support for merge commits with multiple parents

### Tasks
Individual work items with:
- Title, description, and status
- Priority levels and assignees
- Due dates and labels
- Change history through commits

### Branches & Merging
- Create branches for feature development
- Merge branches with conflict resolution
- Visual diff viewer for resolving conflicts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- Path mapping for clean imports
- Separate configs for frontend/backend
- 100% type coverage enforcement

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Structure
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and component integration
- **Type Tests**: TypeScript interface validation

## 🚢 Deployment

### Docker
```bash
# Build production image
docker build -t reallifegit:latest .

# Run container
docker run -p 3000:3000 reallifegit:latest
```

### CI/CD Pipeline
GitHub Actions automatically:
- Runs linting and type checking
- Executes test suite with coverage
- Builds production artifacts
- Performs security audits
- Builds Docker images

## 🛣️ Roadmap

### Immediate Features (MVP)
- ✅ Project structure and TypeScript setup
- ⏳ Interactive commit graph with React Flow
- ⏳ Task management with Kanban boards
- ⏳ Basic API endpoints for CRUD operations
- ⏳ Commit details panel and merge conflict UI

### Future Enhancements
- 🔜 Database persistence (PostgreSQL)
- 🔜 User authentication and authorization
- 🔜 Real-time collaboration with WebSockets
- 🔜 Advanced merge algorithms
- 🔜 Mobile-responsive design
- 🔜 API rate limiting and caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established TypeScript and React patterns
- Write tests for new features
- Use semantic commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [React Flow](https://reactflow.dev/) for graph visualization
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for blazing fast development

---

**Status**: 🚧 In Development - MVP in progress

For detailed architecture documentation, see the [architecture](./architecture/) directory.
For project planning, see the [plan](./plan/) directory.
