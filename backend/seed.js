require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB');
    
    let admin = await User.findOne({ email: 'admin@school.com' });
    if (!admin) {
      admin = await User.create({
        email: 'admin@school.com',
        password: 'password123',
        role: 'ADMIN'
      });
      console.log('Admin seeded successfully!');
    } else {
      console.log('Admin already exists.');
    }
  } catch (error) {
    console.error('Seed Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
