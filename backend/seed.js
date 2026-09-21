const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Visitor = require('./models/Visitor');
const Appointment = require('./models/Appointment');

const { MongoMemoryServer } = require('mongodb-memory-server');

const seedData = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB Memory Server connected at ' + uri);
    
    // Save the URI to .env so frontend and other scripts can use it if they needed to (though memory server is transient)
    // Actually, in a memory server, the backend needs to seed data on startup.
    // So let's just move the seed logic into server.js and remove seed.js to keep the data persistent while the server runs.
    await Visitor.deleteMany();
    await Appointment.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@test.com', password, role: 'admin' },
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
      host: users[2]._id, // Host Employee
      visitor: visitor._id,
      purpose: 'Interview',
      scheduledDate: new Date(),
      scheduledTime: '10:00 AM'
    });

    console.log('Demo Data Seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
