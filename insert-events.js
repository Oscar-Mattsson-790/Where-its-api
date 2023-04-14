const db = require("./model/database");
const events = require("./events.json");

db.events.insert(events, (err) => {
  if (err) {
    console.error("Failed to insert events into the database: ", err);
  } else {
    console.log("Events have been inserted into the database");
  }
});
