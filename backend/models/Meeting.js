const mongoose = require('mongoose')
require('./User')

const meetingSchema = new mongoose.Schema({
  title: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notificationSent: {type: Boolean},
  day: String,
  start: String,
  end: String,
  status: { type: String, default: "pending" },
  responses: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    response: { type: String, enum: ["yes", "no"]}
  }]
});

module.exports =  mongoose.model("Meeting", meetingSchema);
