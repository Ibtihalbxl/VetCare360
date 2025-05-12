const express = require('express');
const router  = express.Router();
const Vet     = require('../models/Vet');

router.get('/', async (req, res) => {
  try {
    const vets = await Vet.find().sort({ lastName: 1 });
    res.json({ success: true, data: vets });
  } catch (err) {
    console.error('GET /api/vets error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newV = await Vet.create(req.body);
    res.status(201).json({ success: true, data: newV });
  } catch (err) {
    console.error('POST /api/vets error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ success: false, error: 'Vétérinaire introuvable' });
    }
    res.json({ success: true, data: vet });
  } catch (err) {
    console.error('GET /api/vets/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const up = await Vet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!up) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: up });
  } catch (err) {
    console.error('PUT /api/vets/:id error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const del = await Vet.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error('DELETE /api/vets/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
