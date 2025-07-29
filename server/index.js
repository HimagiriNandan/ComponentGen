import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userController from './Controller/userController.js';
import llmController from './Controller/llm_config/index.js';
import sessionController from './Controller/sessionController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://component-gen.vercel.app', 'http://localhost:5173'], // Adjust to your frontend port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/user', userController);
app.use('/api/llm', llmController);
app.use('/api/sessions', sessionController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 