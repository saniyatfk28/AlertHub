import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import statsRoutes from './Routes/statsRoutes.js';
import filterRouter from './Controllers/filter.js';
import sosRoutes from './Routes/sosRoutes.js';

import connectDB from "./config/db.js";  // your DB connect module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to database using your custom connectDB
connectDB();

// Middleware setup
app.use(bodyParser.json({ limit: "1000mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));
app.use(express.json());

app.use(cors({
  origin: ["http://localhost:3000", "null"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true,
}));

// Routes
app.use('/api/filters', filterRouter);
app.use('/api/stats', statsRoutes);
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/api/post', PostRoute);  // keeping your original post route too
app.use('/sos', sosRoutes);

// Static files middleware
app.use(express.static(path.join(process.cwd(), 'public')));

// Static page routes
app.get('/incidentfilter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exploreIncident.html'));
});

app.get('/crime-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crime-dashboard.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/monthly-crimes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'monthly-crimes.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
