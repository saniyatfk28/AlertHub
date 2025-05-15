import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import path from 'path';
import statsRoutes from './Routes/statsRoutes.js';
import { fileURLToPath } from 'url';

import filterRouter from './Controllers/filter.js';
// const incidentRouter = require('./Controllers/incident'); // Removed because file does not exist

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json()); // From first config

// Static files
app.use(express.static(path.join(process.cwd(), 'public'))); // From first config
app.use(express.static(path.join(process.cwd(), 'public'))); // From second config

// Database connection
dotenv.config();

console.log('MONGO_DB:', process.env.MONGO_DB); // Debug log to check env variable

mongoose.set('strictQuery', false);

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    )
  )
  .catch((error) => console.log(error));

app.use('/api/filters', filterRouter);
// app.use('/api/incidents', incidentRouter); // Removed because file does not exist
app.use('/api/stats', statsRoutes);
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);

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
