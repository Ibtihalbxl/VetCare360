const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI non défini ! Vérifie ton .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connecté à :', mongoose.connection.db.databaseName);
  } catch (err) {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
