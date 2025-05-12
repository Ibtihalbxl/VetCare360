const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  address:   { type: String },
  city:      { type: String },
  postalCode:{ type: String }
});

module.exports = mongoose.model('Owner', ownerSchema);
