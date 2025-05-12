const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  species:  { type: String, default: '' },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
