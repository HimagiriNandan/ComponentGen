# ComponentGen - Frontend

A modern React-based frontend for ComponentGen, an AI-powered React component generator that allows developers to create, preview, and export React components using natural language descriptions.

## 🚀 Features

### Core Functionality
- **AI-Powered Component Generation**: Create React components using natural language
- **Live Preview**: Real-time component rendering and preview
- **Code Export**: Download complete JSX/TSX and CSS files
- **Session Management**: Save and resume component generation sessions
- **Chat Interface**: Interactive AI assistant for component refinement

### User Experience
- **Modern Dark UI**: Sleek black and zinc color scheme
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Auto-save functionality for session persistence
- **Download Functionality**: Export components with proper naming

### Technical Features
- **Redux State Management**: Centralized state with Redux Toolkit
- **JWT Authentication**: Secure user authentication
- **Service Layer**: Centralized API communication
- **Custom Hooks**: Reusable authentication and session logic

## 🏗️ Architecture

### Frontend Architecture: AI-Enhanced MERN Stack with Redux Toolkit

```
Frontend Architecture:
├── React 18+ (UI Framework)
├── Redux Toolkit (State Management)
├── shadcn/ui + Tailwind CSS (UI Components)
├── Vite (Build Tool)
└── Custom Hooks & Services
```

### Component Structure
```
src/
├── components/           # UI Components
│   ├── ui/              # Reusable shadcn/ui components
│   ├── MainWorkspace.jsx    # Main application workspace
│   ├── SessionManager.jsx   # Session management interface
│   ├── Login.jsx            # Authentication interface
│   ├── Sidebar.jsx          # Chat and input sidebar
│   ├── WorkspacePanel.jsx   # Component preview and code
│   └── landingPage.jsx      # Landing page
├── services/            # API Services
│   └── sessionService.js    # Session and component API calls
├── hooks/               # Custom React Hooks
│   └── authInit.js         # Authentication initialization
├── store/               # Redux Store
│   ├── index.js            # Store configuration
│   └── slices/             # Redux slices
│       ├── userSlice.js        # User authentication state
│       └── sessionsSlice.js    # Session management state
├── config/              # Configuration
│   └── config.js            # API endpoints and settings
└── assets/              # Static assets
```

### State Management
- **Redux Toolkit**: Centralized state management
- **User State**: Authentication and user information
- **Session State**: Component sessions and chat history
- **Real-time Sync**: Auto-save functionality every 30 seconds

## 🛠️ Technology Stack

### Core Technologies
- **React 18+**: Modern React with hooks and functional components
- **Redux Toolkit**: State management with RTK Query
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library

### UI/UX Libraries
- **Lucide React**: Consistent iconography
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Vite**: Development and build tooling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client/MCG-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

### Key Components

#### **MainWorkspace.jsx**
- Main application interface
- Manages component generation workflow
- Handles session state and auto-save
- Coordinates between sidebar and workspace panel

#### **SessionManager.jsx**
- Session management interface
- Grid layout for session cards
- Component name extraction and display
- Session statistics and metrics

#### **Login.jsx**
- Authentication interface
- JWT-based login/signup
- Modern dark theme UI
- Form validation and error handling

#### **Sidebar.jsx**
- Chat interface for AI interaction
- Component generation prompts
- Session management controls
- Real-time message display

#### **WorkspacePanel.jsx**
- Component preview and code display
- Tabbed interface (Preview/Code)
- Download functionality
- Copy code to clipboard

### Services

#### **sessionService.js**
```javascript
// Main API service for backend communication
- createSession()
- getAllSessions()
- generateAndStoreComponent()
- saveSessionState()
- logout()
```

### State Management

#### **Redux Store Structure**
```javascript
{
  user: {
    id: string,
    user: string,
    email: string
  },
  sessions: {
    sessions: array,
    activeSession: object
  }
}
```

## 🎨 UI/UX Design

### Color Scheme
- **Primary Background**: Black (`#000000`)
- **Secondary Background**: Zinc-900 (`#18181b`)
- **Accent Colors**: Blue-600 (`#2563eb`)
- **Text Colors**: White, Zinc-300, Zinc-400
- **Borders**: Zinc-700 (`#3f3f46`)

### Design Principles
- **Dark Theme**: Consistent black and zinc color scheme
- **High Contrast**: Excellent readability and accessibility
- **Modern Aesthetics**: Clean, professional appearance
- **Responsive Design**: Mobile-first approach

## 🔧 Configuration

### Environment Variables
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Build Configuration
- **Vite**: Optimized for React development
- **Tailwind**: Utility-first CSS framework
- **shadcn/ui**: Component library configuration

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Environment Variables
Set the following in Vercel:
- `VITE_BACKEND_URL`: Your backend API URL

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use functional components with hooks
- Follow Redux Toolkit patterns
- Maintain consistent naming conventions
- Add proper TypeScript types (if migrating)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Links

- [Backend Repository](./../server/README.md)
- [API Documentation](./../server/README.md#api-documentation)
- [Deployment Guide](./../server/README.md#deployment)

---

**ComponentGen Frontend** - Built with React, Redux Toolkit, and modern web technologies.
