const express = require("express");
const db = require("../model/database");

const router = express.Router();

// Get all events
router.get("/", (req, res) => {
  db.events.find({}, (err, events) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.json(events);
  });
});

// Order a ticket for an event
router.post("/:eventId/tickets", (req, res) => {
  const { email } = req.body;
  const { eventId } = req.params;

  db.events.findOne({ _id: eventId }, (err, event) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const ticketNumber = Math.floor(Math.random() * 1000000);

    const ticket = {
      email,
      event: event.name,
      eventId,
      ticketNumber,
      verified: false,
    };

    db.tickets.insert(ticket, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ event: event.name, ticketNumber });
    });
  });
});

module.exports = router;
