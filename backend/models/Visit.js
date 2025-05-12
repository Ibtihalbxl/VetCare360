const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  pet:    { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  vet:    { type: mongoose.Schema.Types.ObjectId, ref: 'Vet', required: true },
  date:   { type: Date, required: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Visit', VisitSchema);
