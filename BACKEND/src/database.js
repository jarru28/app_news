const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/database_prototype';
const MONGO_URI_TEST = `${MONGO_URI}_test`;

const connectDB = () => {
  mongoose.connect(process.env.NODE_ENV === 'test' ? MONGO_URI_TEST : MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
};

const disconnectDB = () => {
  mongoose.disconnect()
};

module.exports = {
  connectDB,
  disconnectDB
};
