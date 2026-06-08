// Force Node.js to use working DNS servers
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);  // Google + Cloudflare DNS


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS - single configuration
// Dynamic CORS - allows both local and production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL  // Will add Netlify URL later
];
app.use(express.json());

// Mount routes
app.use('/api/todos', todoRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});