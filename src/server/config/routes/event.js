const EventController = require("../../event");

module.exports = app => {
  app.post("/events", EventController.create);
  app.get("/events", EventController.list);
  app.put("/events/:id", EventController.update);
  app.delete("/events/:id", EventController.remove);
};
