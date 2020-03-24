const Event = require('./event'),
  moment = require("moment"),
  _ = require('lodash');

let io;
function useSocket(socket) {
  io = socket;
}


function create(req, res) {
  Event.create(req.body, (err, createdEvent) => {
    if (err) { return res.status(400).send('Failed to create new Event.'); }
    _alleventList({}, () => { })
    return res.status(200).send(createdEvent);
  });
}

function update(req, res) {
  Event.findById(req.params.id, (err, currentEvent) => {
    if (err) { return res.status(400).send('Failed to fetch Event.'); }
    if (!currentEvent) { return res.status(404).send('Event not found'); }

    _.extend(currentEvent, req.body);
    currentEvent.lastUpdatedAt = Date.now();
    currentEvent.save((err, updatedEvent) => {
      if (err) { return res.status(400).send('Error to update Event'); }
      _alleventList({}, () => { })
      return res.status(200).send(updatedEvent);
    });
  })
}

function _alleventList(query, callback) {
  Event.aggregate([
    { $match: query },
    {
      $group:
      {
        _id: '$eventDate',
        eventCount: { $sum: 1 },
        eventList: { $push: '$_id' }
      }
    }
  ], (err, result) => {
    if (err) { return callback(new Error('Error')); }
    Event.populate(result, { path: 'eventList' }, (err, populatedEventList) => {
      if (err) { return callback(new Error('Error')); }
      io.emit('new:Event', populatedEventList);
      return callback(null, populatedEventList);
    });
  });
}


function list(req, res) {
  const year = req.query.year,
    month = req.query.month,
    startDate = moment([year, month]).toISOString(),
    endDate = moment(startDate).endOf('month').toISOString();
  let query = (year && month) ? { // query for getting particular month eventList
    eventDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } : {};
  _alleventList(query, (err, eventList) => {
    if (err) { return res.status(400).send(err); }
    return res.status(200).send(eventList);
  })
}

function remove(req, res) {
  Event.findById(req.params.id, (err, currentEvent) => {
    if (err) { return res.status(400).send('Failed to find Event.') }
    currentEvent.lastUpdatedAt = Date.now();
    currentEvent.deleted = true;
    currentEvent.save((err) => {
      if (err) { return res.status(400).send('Failed to delete Event.'); }
      _alleventList({}, () => { })
      res.status(200).send('Event Deleted.');
    });
  });
}


module.exports = {
  create,
  update,
  list,
  remove,
  useSocket
}