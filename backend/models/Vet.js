const mongoose = require('mongoose');

const VetSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  specialty: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vet', VetSchema);
