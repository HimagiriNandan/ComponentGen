# ComponentGen

An AI-powered React component generator that allows developers to create, preview, and export React components using natural language descriptions. Built with modern web technologies and Google Gemini AI.

## 🚀 Live Demo

[ComponentGen - AI-Powered Component Generator](https://component-gen.vercel.app)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Generation**: Create React components using natural language
- **Live Preview**: Real-time component rendering and preview
- **Code Export**: Download complete JSX/TSX and CSS files
- **Session Management**: Save and resume component generation sessions
- **Chat Interface**: Interactive AI assistant for component refinement

### 🎨 User Experience
- **Modern Dark UI**: Sleek black and zinc color scheme
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Auto-save functionality for session persistence
- **Download Functionality**: Export components with proper naming

### 🔧 Technical Features
- **JWT Authentication**: Secure user authentication
- **Redux State Management**: Centralized state with Redux Toolkit
- **Service Layer**: Centralized API communication
- **Custom Hooks**: Reusable authentication and session logic

## 🏗️ Architecture

### **AI-Enhanced MERN Stack with Redux Toolkit**

```
ComponentGen Architecture:
├── Frontend (React + Redux Toolkit)
│   ├── React 18+ (UI Framework)
│   ├── Redux Toolkit (State Management)
│   ├── shadcn/ui + Tailwind CSS (UI Components)
│   ├── Vite (Build Tool)
│   └── Custom Hooks & Services
├── Backend (Node.js + Express)
│   ├── Node.js (Runtime)
│   ├── Express.js (Web Framework)
│   ├── MongoDB + Mongoose (Database)
│   ├── Google Gemini AI (AI Service)
│   ├── JWT Authentication (Security)
│   └── Redis (Caching - Optional)
└── AI Integration
    ├── Google Gemini AI (Language Model)
    ├── Structured Output (JSON Schema)
    ├── Error Recovery (Graceful Handling)
    └── Prompt Engineering (Optimized Prompts)
```

## 📁 Project Structure

```
ComponentGen/
├── client/MCG-Platform/     # Frontend Application
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── services/        # API Services
│   │   ├── store/          # Redux Store
│   │   ├── hooks/          # Custom Hooks
│   │   └── config/         # Configuration
│   ├── package.json
│   └── README.md           # Frontend Documentation
├── server/                 # Backend Application
│   ├── Controller/         # Route Handlers
│   ├── Model/             # Database Models
│   ├── Middleware/        # Custom Middleware
│   ├── package.json
│   └── README.md          # Backend Documentation
└── README.md              # Main Project Documentation
```

## 🛠️ Technology Stack

### Frontend
- **React 18+**: Modern React with hooks and functional components
- **Redux Toolkit**: State management with RTK Query
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Consistent iconography
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **Google Gemini AI**: Advanced language model
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management

### Development & Deployment
- **Vercel**: Frontend and backend deployment
- **MongoDB Atlas**: Cloud database
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini AI API key
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ComponentGen
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   
   # Create .env file
   echo "PORT=5000
   MONGO_URL=mongodb://localhost:27017/componentgen
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_API_KEY=your-gemini-api-key
   NODE_ENV=development" > .env
   
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client/MCG-Platform
   npm install
   
   # Create .env file
   echo "VITE_BACKEND_URL=http://localhost:5000" > .env
   
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 📡 API Endpoints

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User authentication
- `POST /api/user/logout` - User logout
- `GET /api/user/me` - Get current user

### Session Management
- `GET /api/sessions` - Get all sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/:id` - Get specific session
- `PUT /api/sessions/:id` - Update session
- `DELETE /api/sessions/:id` - Delete session

### AI Component Generation
- `POST /api/llm/generate-component` - Generate React component

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

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware for route protection

### API Security
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Comprehensive input checking
- **Error Handling**: Graceful error responses
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel Deployment
1. **Frontend**: Connect GitHub repository to Vercel
2. **Backend**: Deploy as serverless functions
3. **Environment Variables**: Set in Vercel dashboard
4. **Database**: Use MongoDB Atlas

### Environment Variables
```env
# Backend
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/componentgen
JWT_SECRET=your-production-jwt-secret
GOOGLE_API_KEY=your-production-gemini-api-key
NODE_ENV=production

# Frontend
VITE_BACKEND_URL=https://your-backend-url.vercel.app
```

## 📊 Features Overview

### Component Generation
- **Natural Language Input**: Describe components in plain English
- **AI Processing**: Google Gemini AI generates React components
- **Structured Output**: Consistent JSX and CSS generation
- **Error Handling**: Graceful handling of AI service failures

### Session Management
- **Auto-save**: Real-time session persistence
- **Session History**: Complete chat and component history
- **Component Extraction**: Automatic component name detection
- **Grid Layout**: Responsive session card display

### User Experience
- **Modern Interface**: Dark theme with high contrast
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Live preview and auto-save
- **Download Functionality**: Export components with proper naming

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use functional components with hooks
- Follow Redux Toolkit patterns
- Implement proper error handling
- Add comprehensive documentation
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Documentation

- [Frontend Documentation](./client/MCG-Platform/README.md)
- [Backend Documentation](./server/README.md)
- [API Documentation](./server/README.md#api-documentation)

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation
- Review the deployment guides

## 🙏 Acknowledgments

- **Google Gemini AI**: For providing the AI capabilities
- **shadcn/ui**: For the beautiful component library
- **Vercel**: For seamless deployment
- **MongoDB Atlas**: For reliable database hosting

---

**ComponentGen** - Built with React, Node.js, MongoDB, and Google Gemini AI.

*Revolutionizing component development with AI-powered generation.* 