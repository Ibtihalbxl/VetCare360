const mongoose = require('mongoose');

const OwnerSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String },
  address:    { type: String },
  city:       { type: String },
  postalCode: { type: String },
  createdAt:  { type: Date, default: Date.now },
});

module.exports = mongoose.model('Owner', OwnerSchema);
