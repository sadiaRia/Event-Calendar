const Event = require('./event');

function create(req, res) {
  Event.create(req.body, (err, createdEvent) => {
    if (err) { return res.status(400).send('Failed to create new Event.'); }
    res.status(200).send(createdEvent);
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
      return res.status(200).send(updatedEvent);
    });
  })
}

function list(req, res) {
  const query = req.query || {}
  Event.aggregate([
    { $match: query },
    {
      $group:
      {
        _id: '$eventDate',
        eventCount: { $sum: 1 },
        evetList: { $push: '$_id' }
      }
    }
  ], (err, result) => {
    if (err) { return res.status(400).send(err); }
    Event.populate(result, { path: 'evetList' }, (err, populatedEventList) => {
      if (err) { return res.status(400).send(err); }
      return res.status(200).send(populatedEventList);
    });
  });
}

function remove(req, res) {
  Event.findById(req.params.id, (err, currentEvent) => {
    if (err) { return res.status(400).send('Failed to find Event.') }
    currentEvent.lastUpdatedAt = Date.now();
    currentEvent.deleted = true;
    currentEvent.save((err) => {
      if (err) { return res.status(400).send('Failed to delete Event.'); }
      res.status(200).send('Event Deleted.');
    });
  });
}


module.exports = {
  create,
  update,
  list,
  remove
}