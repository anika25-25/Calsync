const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');


// ✅ GET availability (user-specific)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) return res.json([]);

    const data = await Availability.findAll({
      where: { userId }
    });

    res.json(data);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ message: 'Error fetching availability' });
  }
});


// ✅ SAVE availability (FIXED)
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const userId = data[0]?.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    // delete only this user's data
    await Availability.destroy({ where: { userId } });

    // insert new
    const created = await Availability.bulkCreate(data);

    res.json({ success: true, data: created });

  } catch (err) {
    console.error("SAVE ERROR FULL:", err);
    res.status(500).json({ message: 'Error saving availability' });
  }
});


module.exports = router;