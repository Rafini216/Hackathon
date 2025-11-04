const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  notification: Boolean,
  notificationStatus: String, // pendente, confirmada
  attendeeStatus: [
    {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      status: String // pendente, confirmada
    }
  ],
  meetingDate: [
    {
      start: Date,
      end: Date
    }
  ],
  participants: [
    {
      id: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model('Meeting', meetingSchema);

