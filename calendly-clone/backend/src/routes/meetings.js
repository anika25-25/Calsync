const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const EventType = require('../models/EventType');
const { sequelize } = require('../config/db');

const DEFAULT_USER_ID = 1;

// GET upcoming
router.get('/upcoming', async (req, res, next) => {
  try {
    const meetings = await Booking.findAll({
      where: {
        hostId: DEFAULT_USER_ID,
        status: 'confirmed',
        startTime: { [Op.gte]: new Date() },
      },
      include: [{ model: EventType }],
      order: [['startTime', 'ASC']],
    });
    res.json(meetings);
  } catch (err) { next(err); }
});

// GET past
router.get('/past', async (req, res, next) => {
  try {
    const meetings = await Booking.findAll({
      where: {
        hostId: DEFAULT_USER_ID,
        startTime: { [Op.lt]: new Date() },
      },
      include: [{ model: EventType }],
      order: [['startTime', 'DESC']],
    });
    res.json(meetings);
  } catch (err) { next(err); }
});

// PATCH cancel
router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    await booking.update({ status: 'cancelled' });
    res.json(booking);
  } catch (err) { next(err); }
});

module.exports = router;
router.get('/stats', async (req, res, next) => {
  try {
    const total = await Booking.count();

    const upcoming = await Booking.count({
      where: { startTime: { [Op.gte]: new Date() } },
    });

    const past = await Booking.count({
      where: { startTime: { [Op.lt]: new Date() } },
    });

    // 🔥 Most popular event type
    const popular = await Booking.findAll({
      attributes: [
        'eventTypeId',
        [sequelize.fn('COUNT', sequelize.col('eventTypeId')), 'count'],
      ],
      group: ['eventTypeId'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: 1,
      include: [{ model: EventType }],
    });

    res.json({
      total,
      upcoming,
      past,
      popular: popular[0] || null,
    });

  } catch (err) {
    next(err);
  }
});
