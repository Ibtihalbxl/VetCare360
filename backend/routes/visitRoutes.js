const express = require('express');
const router  = express.Router();
const Visit   = require('../models/Visit');

router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.pet) filter.pet = req.query.pet;
    if (req.query.vet) filter.vet = req.query.vet;

    const visits = await Visit.find(filter)
      .populate({
        path: 'pet',
        select: 'name owner',
        populate: { path: 'owner', select: 'firstName lastName' }
      })
      .populate('vet', 'firstName lastName');

    return res.json({ success: true, data: visits });
  } catch (err) {
    console.error('GET /api/visits error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const v = await Visit.findById(req.params.id)
      .populate({
        path: 'pet',
        select: 'name owner',
        populate: { path: 'owner', select: 'firstName lastName' }
      })
      .populate('vet', 'firstName lastName');
    if (!v) return res.status(404).json({ success: false, error: 'Visite introuvable' });
    return res.json({ success: true, data: v });
  } catch (err) {
    console.error('GET /api/visits/:id error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  console.log('→ POST /api/visits body:', req.body);
  try {
   
    const newV = await Visit.create(req.body);
    console.log('✔ Visite créée en base:', newV);
    return res.status(201).json({ success: true, data: newV });
  } catch (err) {
    console.error('✖ Erreur création visite:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await Visit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'pet',
      select: 'name owner',
      populate: { path: 'owner', select: 'firstName lastName' }
    })
    .populate('vet', 'firstName lastName');

    if (!updated) return res.status(404).json({ success: false, error: 'Visite introuvable' });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error('PUT /api/visits/:id error:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const del = await Visit.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ success: false, error: 'Visite introuvable' });
    return res.json({ success: true, data: {} });
  } catch (err) {
    console.error('DELETE /api/visits/:id error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
