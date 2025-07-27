# Component Generator Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @google/generative-ai cors dotenv
```

### 2. Environment Variables
Create a `.env` file in the server directory with the following variables:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/your_database_name

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port
PORT=5000
```

### 3. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 4. Start the Server
```bash
npm start
```

## API Endpoints

### Component Generation
- `POST /api/llm/generate-component` - Generate React components
- `GET /api/llm/suggestions` - Get component suggestions

### Authentication
- `POST /api/user/signup` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/me` - Get user profile 