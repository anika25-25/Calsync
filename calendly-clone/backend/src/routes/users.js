const express = require('express');
const router = express.Router();
const User = require('../models/User');

// CREATE USER (LOGIN)
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name required' });
    }

    // check if user exists
    let user = await User.findOne({ where: { name } });

    if (!user) {
      user = await User.create({ name });
    }

    res.json(user);

  } catch (err) {
    console.error("USER ERROR:", err);
    res.status(500).json({ message: 'User creation failed' });
  }
});

module.exports = router;