const moment = require("moment"),
  _ = require('lodash');

function getCalender(req, res) {
  let year = req.query.year;
  let month = parseInt(req.query.month - 1);
  let date = new Date(year, month, 1);
  console.log(date);
  let allDays = [];
  while (date.getMonth().toString() === month.toString()) {
    allDays.push({
      date: moment(date).format("DD"),
      day: moment(date).format("ddd")
    });
    date.setDate(date.getDate() + 1);
  }
  _formatdate(allDays, (err, calenderData) => {
    if (err) { return res.status(400).send('Error to get Calender'); }
    return res.status(200).send(calenderData);
  })
}

function _formatdate(allDays, callback) {

  let calenderData = [];
  let calenderObj = {
    sun: '',
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: ''
  };
  const d = new Date();
  const sday = d.getDay();
  _.forEach(allDays, (allday) => {
    calenderObj[`${allday.day.toLowerCase()}`] = allday.date;
    if (allday.day.toLowerCase() === 'sat') {
      calenderData.push(calenderObj);
      calenderObj = {
        sun: '',
        mon: '',
        tue: '',
        wed: '',
        thu: '',
        fri: '',
        sat: ''

      };
    }
  })
  calenderData.push(calenderObj);
  return callback(null, calenderData);
}

module.exports = {
  getCalender
}
