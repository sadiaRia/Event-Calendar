const mongoose = require('mongoose'),
 Plugins = require('../utils/plugins').Plugins,
  Schema = mongoose.Schema;

let EventtSchema = new Schema({
  title: {type: String},
  description: {type: String},
  eventType: {type: String},
  eventDate: {type:Date},
  createdAt: {type: Date, default: Date.now()},
  lastUpdatedAt: {type: Date},
  deleted: {type: Boolean, default: false},
});

EventtSchema.plugin(Plugins.documentDeleted);

// Export the model
const Event = mongoose.model('Event', EventtSchema);
module.exports = Event;
