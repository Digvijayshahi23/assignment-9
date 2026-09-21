const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./models/User');
const Visitor = require('./models/Visitor');
const Appointment = require('./models/Appointment');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let isDbConnected = false;
const connectDB = async () => {
  if (isDbConnected) return;
  try {
    // If user provided a real MONGO_URI (or DATABASE_URL) in Vercel env, use it
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (process.env.VERCEL || (dbUrl && !dbUrl.includes('127.0.0.1'))) {
      await mongoose.connect(dbUrl);
      isDbConnected = true;
      console.log('Connected to remote MongoDB');
    } else {
      // Local dev fallback
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      isDbConnected = true;
      console.log('MongoDB Memory Server connected at ' + uri);
      
      // Seed Data if empty
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
          { name: 'Admin User', email: 'admin@test.com', password, role: 'admin' },
          { name: 'Digvijay Admin', email: 'shahidigvijay144@gmail.com', password, role: 'admin' },
          { name: 'Security Guard', email: 'security@test.com', password, role: 'security' },
          { name: 'Host Employee', email: 'host@test.com', password, role: 'host', department: 'IT' }
        ]);

        const visitor = await Visitor.create({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          company: 'Tech Corp'
        });

        await Appointment.create({
          host: users[2]._id,
          visitor: visitor._id,
          purpose: 'Interview',
          scheduledDate: new Date(),
          scheduledTime: '10:00 AM'
        });
        console.log('Demo Data Seeded successfully');
      }
    }
  } catch (err) {
    console.error('DB Connection Error:', err);
  }
};

// Initiate connection (Mongoose will buffer queries until connected)
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/passes', require('./routes/passes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Only listen if not in a serverless environment (like Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel Serverless
module.exports = app;
