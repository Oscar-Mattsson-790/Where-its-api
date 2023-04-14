require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const eventsRouter = require("./routes/events");
const usersRouter = require("./routes/users");
const db = require("./model/database");
const PORT = process.env.PORT || 8000;

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// Routes
app.use("/events", eventsRouter);
app.use("/users", usersRouter);

// Verify ticket number middleware
const verifyTicket = (req, res, next) => {
  const { apiKey } = req.query;
  const { ticketNumber } = req.params;

  db.tickets.findOne({ ticketNumber }, (err, ticket) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }

    if (ticket.verified) {
      res.status(400).json({ error: "Ticket already verified" });
      return;
    }

    jwt.verify(apiKey, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ error: "Invalid API key" });
        return;
      }

      if (decoded.email !== ticket.email) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      req.ticket = ticket;
      next();
    });
  });
};

// Verify ticket endpoint
app.get("/verify/:ticketNumber", verifyTicket, (req, res) => {
  const { ticket } = req;

  db.tickets.update(
    { ticketNumber },
    { $set: { verified: true } },
    {},
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ event: ticket.event, ticketNumber: ticket.ticketNumber });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log("Server started");
});
