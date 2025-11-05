const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {type: String},
  email: {type: String},
  password: {type: String}
  // timezone: { type: String, default: "UTC" },
  // preferences: {
  //   avoidLate: Boolean,
  //   preferredDays: [String]
  // }
});

module.exports = mongoose.model("User", userSchema);
