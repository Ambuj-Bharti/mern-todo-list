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

// CORS configuration - Allow your Vercel frontend
const allowedOrigins = [
  'http://localhost:3000',  // Local development
  'https://mern-todo-list-iota.vercel.app',  // Your production frontend
  'https://mern-todo-list-5gug5p4tq-ambuj-bharti-s-projects.vercel.app'  // Preview deployment
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


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