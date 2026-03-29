const express = require('express');
const router = express.Router();
const EventType = require('../models/EventType');

const DEFAULT_USER_ID = 1;

// GET all event types
router.get('/', async (req, res, next) => {
  try {
    const eventTypes = await EventType.findAll({ where: { userId: DEFAULT_USER_ID } });
    res.json(eventTypes);
  } catch (err) { next(err); }
});

// GET single by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const et = await EventType.findOne({
      where: { slug: req.params.slug, userId: DEFAULT_USER_ID },
    });
    if (!et) return res.status(404).json({ message: 'Not found' });
    res.json(et);
  } catch (err) { next(err); }
});

// POST create
router.post('/', async (req, res, next) => {
  try {
    const { name, duration, description, color } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const et = await EventType.create({
      userId: DEFAULT_USER_ID, name, slug, duration, description, color,
    });
    res.status(201).json(et);
  } catch (err) { next(err); }
});

// PUT update
router.put('/:id', async (req, res, next) => {
  try {
    const et = await EventType.findByPk(req.params.id);
    if (!et) return res.status(404).json({ message: 'Not found' });
    await et.update(req.body);
    res.json(et);
  } catch (err) { next(err); }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const et = await EventType.findByPk(req.params.id);
    if (!et) return res.status(404).json({ message: 'Not found' });
    await et.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
