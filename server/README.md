# ComponentGen - Backend

A robust Node.js backend for ComponentGen, providing AI-powered React component generation, user authentication, session management, and RESTful API services.

## 🚀 Features

### Core Functionality
- **AI Component Generation**: Integration with Google Gemini AI for React component creation
- **User Authentication**: JWT-based authentication with secure cookie handling
- **Session Management**: Complete CRUD operations for component sessions
- **Real-time Processing**: Streamlined component generation workflow
- **File Export**: Component download with proper naming and structure

### API Services
- **RESTful API**: Clean, consistent API endpoints
- **Error Handling**: Comprehensive error management and validation
- **CORS Support**: Cross-origin resource sharing configuration
- **Rate Limiting**: Built-in request throttling
- **Security**: JWT tokens, password hashing, input validation

### AI Integration
- **Google Gemini AI**: Advanced language model for component generation
- **Structured Output**: JSON schema validation for consistent responses
- **Error Recovery**: Graceful handling of AI service failures
- **Prompt Engineering**: Optimized system prompts for React components

## 🏗️ Architecture

### Backend Architecture: AI-Enhanced MERN Stack

```
Backend Architecture:
├── Node.js (Runtime)
├── Express.js (Web Framework)
├── MongoDB + Mongoose (Database)
├── Google Gemini AI (AI Service)
├── JWT Authentication (Security)
└── Redis (Caching - Optional)
```

### Project Structure
```
server/
├── index.js                 # Main server entry point
├── Controller/              # Route handlers and business logic
│   ├── userController.js        # User authentication endpoints
│   ├── sessionController.js     # Session management endpoints
│   └── llm_config/
│       └── index.js            # AI component generation
├── Model/                   # Database schemas
│   ├── userSchema.js           # User model
│   └── Session.js             # Session model
├── Middleware/              # Custom middleware
│   └── authMiddleware.js       # JWT authentication middleware
├── redisClient.js           # Redis configuration (optional)
├── setup-env.js            # Environment setup
└── package.json            # Dependencies and scripts
```

### Database Schema

#### **User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Session Model**
```javascript
{
  prompt: String,
  generatedComponents: [String],
  description: String,
  tags: [String],
  componentsCount: Number,
  chatMessages: [{
    id: String,
    isUser: Boolean,
    text: String,
    time: Date,
    prompt: String,
    generatedJsx: String,
    generatedCss: String
  }],
  currentJsx: String,
  currentCss: String,
  lastPrompt: String,
  lastGeneratedJsx: String,
  lastGeneratedCss: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Technology Stack

### Core Technologies
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication

### AI & External Services
- **Google Gemini AI**: Advanced language model
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token management

### Development & Production
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **cookie-parser**: Cookie parsing middleware

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini AI API key
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/componentgen
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_API_KEY=your-gemini-api-key
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if local)
   mongod
   
   # Or use MongoDB Atlas
   # Update MONGO_URL in .env
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Start production server**
   ```bash
   npm start
   ```

## 📡 API Documentation

### Authentication Endpoints

#### **POST /api/user/signup**
Create a new user account.
```javascript
// Request Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST /api/user/login**
Authenticate user and get JWT token.
```javascript
// Request Body
{
  "email": "john@example.com",
  "password": "securepassword"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### **POST /api/user/logout**
Logout user and clear JWT token.
```javascript
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### **GET /api/user/me**
Get current user information (protected route).
```javascript
// Response
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Session Management Endpoints

#### **GET /api/sessions**
Get all sessions for the authenticated user.
```javascript
// Response
{
  "success": true,
  "data": [
    {
      "_id": "session_id",
      "prompt": "Create a button component",
      "description": "A reusable button component",
      "currentJsx": "function Button() { ... }",
      "currentCss": ".button { ... }",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### **POST /api/sessions**
Create a new session.
```javascript
// Request Body
{
  "prompt": "Create a button component",
  "description": "A reusable button component",
  "tags": ["button", "ui"],
  "componentsCount": 0
}
```

#### **GET /api/sessions/:id**
Get a specific session by ID.
```javascript
// Response
{
  "success": true,
  "data": {
    "_id": "session_id",
    "prompt": "Create a button component",
    "chatMessages": [...],
    "currentJsx": "function Button() { ... }",
    "currentCss": ".button { ... }"
  }
}
```

#### **PUT /api/sessions/:id**
Update session with new chat messages and generated code.
```javascript
// Request Body
{
  "chatMessages": [...],
  "currentJsx": "function Button() { ... }",
  "currentCss": ".button { ... }"
}
```

#### **DELETE /api/sessions/:id**
Delete a session.
```javascript
// Response
{
  "success": true,
  "message": "Session deleted successfully"
}
```

### AI Component Generation

#### **POST /api/llm/generate-component**
Generate React component using AI.
```javascript
// Request Body
{
  "prompt": "Create a blue button with hover effects"
}

// Response
{
  "success": true,
  "data": {
    "jsx": "function BlueButton() { return <button className='blue-btn'>Click me</button>; }",
    "css": ".blue-btn { background: blue; color: white; }"
  }
}
```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URL=mongodb://localhost:27017/componentgen

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Service
GOOGLE_API_KEY=your-gemini-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### CORS Configuration
```javascript
// Configured for development and production
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **HTTP-only Cookies**: XSS protection
- **Password Hashing**: bcryptjs for secure password storage
- **Protected Routes**: Middleware for route protection

### Input Validation
- **Request Validation**: Comprehensive input checking
- **Error Handling**: Graceful error responses
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

### API Security
- **CORS Configuration**: Controlled cross-origin access
- **Rate Limiting**: Request throttling (configurable)
- **Environment Variables**: Secure configuration management

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build Settings**:
   - **Build Command**: `npm install`
   - **Output Directory**: `./`
   - **Install Command**: `npm install`
3. **Set Environment Variables** in Vercel dashboard
4. **Deploy**: Automatic deployment on push to main branch

### Environment Variables for Production
```env
PORT=5000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/componentgen
JWT_SECRET=your-production-jwt-secret
GOOGLE_API_KEY=your-production-gemini-api-key
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create new cluster
3. Set up database user
4. Get connection string
5. Update `MONGO_URL` in environment variables

## 🧪 Testing

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test component generation
curl -X POST http://localhost:5000/api/llm/generate-component \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a button component"}'
```

### Database Testing
```bash
# Connect to MongoDB
mongosh "mongodb://localhost:27017/componentgen"

# Test queries
db.sessions.find()
db.users.find()
```

## 📊 Monitoring & Logging

### Error Logging
- **Console Logging**: Development error tracking
- **Error Middleware**: Centralized error handling
- **Validation Errors**: Detailed input validation feedback

### Performance Monitoring
- **Response Time**: API endpoint performance tracking
- **Database Queries**: Mongoose query optimization
- **Memory Usage**: Node.js memory monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use ES6+ JavaScript features
- Follow Express.js best practices
- Implement proper error handling
- Add comprehensive API documentation
- Write meaningful commit messages

### Testing Guidelines
- Test all API endpoints
- Verify authentication flows
- Test AI integration
- Validate database operations
- Check error handling

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Links

- [Frontend Repository](./../client/MCG-Platform/README.md)
- [API Documentation](#api-documentation)
- [Deployment Guide](#deployment)

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation
- Review the deployment guide

---

**ComponentGen Backend** - Built with Node.js, Express, MongoDB, and Google Gemini AI. 