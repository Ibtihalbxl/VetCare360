const express = require('express');
const router  = express.Router();
const Owner   = require('../models/Owner');

router.get('/', async (req, res) => {
  try {
    const list = await Owner.find();
    res.json({ success: true, data: list });
  } catch (err) {
    console.error('GET /api/owners error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (!owner) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: owner });
  } catch (err) {
    console.error('GET /api/owners/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newOwner = await Owner.create(req.body);
    res.status(201).json({ success: true, data: newOwner });
  } catch (err) {
    console.error('POST /api/owners error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await Owner.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('PUT /api/owners/:id error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const del = await Owner.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, error: 'Introuvable' });
    res.json({ success: true, data: {} });
  } catch (err) {
    console.error('DELETE /api/owners/:id error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
