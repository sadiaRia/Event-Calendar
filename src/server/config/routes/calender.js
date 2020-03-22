const CalenderController = require("../../calender");

module.exports = app => {
  app.get("/getCalender", CalenderController.getCalender);
};
