const express = require('express');
const mongoose = require('mongoose');
const ownerRoutes = require('./routes/ownerRoutes');
const petRoutes   = require('./routes/petRoutes');
const vetRoutes   = require('./routes/vetRoutes');
const visitRoutes = require('./routes/visitRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/vetcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connecté à : vetcare'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

app.use('/api/owners', ownerRoutes);
app.use('/api/pets',   petRoutes);
app.use('/api/vets',   vetRoutes);
app.use('/api/visits', visitRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 API en écoute sur :${PORT}`));
