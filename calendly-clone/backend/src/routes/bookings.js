const Booking = require('../models/Booking');
const EventType = require('../models/EventType');
const Availability = require('../models/Availability');
const { Op } = require('sequelize');
const express = require('express');
const router = express.Router();
router.get('/slots', async (req, res, next) => {
  try {
    const { slug, date } = req.query;

    const et = await EventType.findOne({ where: { slug } });
    if (!et) return res.status(404).json({ message: 'Event type not found' });

    const d = new Date(date + 'T00:00:00');
    const dayOfWeek = d.getDay();

    const avail = await Availability.findOne({
      where: { userId: et.userId, dayOfWeek, isActive: true },
    });

    if (!avail) return res.json({ slots: [], suggestions: [] });

    const [startH, startM] = avail.startTime.split(':').map(Number);
    const [endH, endM] = avail.endTime.split(':').map(Number);

    const slots = [];

    for (let m = startH * 60 + startM; m + et.duration <= endH * 60 + endM; m += et.duration) {
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(m / 60), m % 60, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + et.duration);

      const conflict = await Booking.findOne({
        where: {
          eventTypeId: et.id,
          status: 'confirmed',
          startTime: { [Op.lt]: slotEnd },
          endTime: { [Op.gt]: slotStart },
        },
      });

      if (!conflict) {
        slots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
        });
      }
    }

    // 🔥 IF NO SLOTS → FIND NEXT AVAILABLE
    if (slots.length === 0) {
      const suggestions = [];

      for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(d);
        nextDate.setDate(d.getDate() + i);

        const nextDay = nextDate.getDay();

        const nextAvail = await Availability.findOne({
          where: { userId: et.userId, dayOfWeek: nextDay, isActive: true },
        });

        if (!nextAvail) continue;

        const [sh, sm] = nextAvail.startTime.split(':').map(Number);
        const [eh, em] = nextAvail.endTime.split(':').map(Number);

        let m = sh * 60 + sm;

        while (m + et.duration <= eh * 60 + em) {
          const start = new Date(nextDate);
          start.setHours(Math.floor(m / 60), m % 60, 0, 0);

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + et.duration);

          const conflict = await Booking.findOne({
            where: {
              eventTypeId: et.id,
              status: 'confirmed',
              startTime: { [Op.lt]: end },
              endTime: { [Op.gt]: start },
            },
          });

          if (!conflict) {
            suggestions.push({
              startTime: start.toISOString(),
              endTime: end.toISOString(),
            });

            if (suggestions.length >= 5) break;
          }

          m += et.duration;
        }

        if (suggestions.length >= 5) break;
      }

      return res.json({ slots: [], suggestions });
    }

    res.json({ slots, suggestions: [] });

  } catch (err) {
    next(err);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { slug, inviteeName, inviteeEmail, startTime } = req.body;

    const et = await EventType.findOne({ where: { slug } });
    if (!et) return res.status(404).json({ message: "Event type not found" });

    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + et.duration);

    const conflict = await Booking.findOne({
  where: {
    eventTypeId: et.id,
    status: 'confirmed',
    startTime: { [Op.lt]: end },
    endTime: { [Op.gt]: start },
  },
});

if (conflict) {
  return res.status(409).json({
    message: "This slot is already booked"
  });
}

   const booking = await Booking.create({
  eventTypeId: et.id,
  hostId: et.userId,  // ✅ add this line
  inviteeName,
  inviteeEmail,
  startTime: start,
  endTime: end
});
    res.json(booking);
  } catch (err) {
    next(err);
  }
});
router.delete("/:id", async (req, res) => {
  await Booking.destroy({
    where: { id: req.params.id }
  });

  res.json({ message: "Booking cancelled" });
});
router.put("/:id/reschedule", async (req, res, next) => {
  try {
    const { startTime } = req.body;

    const booking = await Booking.findByPk(req.params.id, {
      include: [EventType],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + booking.EventType.duration);

    // 🔥 conflict check
    const conflict = await Booking.findOne({
      where: {
        id: { [Op.ne]: booking.id }, // exclude current
        eventTypeId: booking.eventTypeId,
        status: 'confirmed',
        startTime: { [Op.lt]: end },
        endTime: { [Op.gt]: start },
      },
    });

    if (conflict) {
      return res.status(409).json({
        message: "This new slot is already booked",
      });
    }

    booking.startTime = start;
    booking.endTime = end;

    await booking.save();

    res.json({ message: "Rescheduled successfully", booking });

  } catch (err) {
    next(err);
  }
});
module.exports = router;