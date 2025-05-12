const mongoose = require('mongoose');

const vetSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  specialty: { type: String }
});

module.exports = mongoose.model('Vet', vetSchema);
