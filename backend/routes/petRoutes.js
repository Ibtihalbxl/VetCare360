const express = require('express');
const router  = express.Router();
const Pet     = require('../models/Pet');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.owner) filter.owner = req.query.owner;
    const pets = await Pet.find(filter)
      .populate('owner', 'firstName lastName')
      .sort('name');
    res.json({ success: true, data: pets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/', async (req, res) => {
  const list = await Pet.find().populate('owner', 'firstName lastName');
  res.json({ success: true, data: list });
});

router.get('/:id', async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate('owner', 'firstName lastName');
  if (!pet) return res.status(404).json({ success: false, error: 'Introuvable' });
  res.json({ success: true, data: pet });
});


router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
