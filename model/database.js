const Datastore = require("nedb");

const eventsDB = new Datastore({
  filename: "./data/events.db",
  autoload: true,
});
const usersDB = new Datastore({ filename: "./data/users.db", autoload: true });
const ticketsDB = new Datastore({
  filename: "./data/tickets.db",
  autoload: true,
});

module.exports = {
  events: eventsDB,
  users: usersDB,
  tickets: ticketsDB,
};
