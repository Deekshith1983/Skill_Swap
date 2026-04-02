const mongoose = require('mongoose');
const { Schema } = mongoose;
const RatingSchema = require('./Rating');

const SessionSchema = new Schema({
  userA:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userB:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  skillA:      { type: String, required: true },
  skillB:      { type: String, required: true },
  status:      { type: String,
                 enum: ['Pending','Scheduled','Ongoing','Completed','Cancelled'],
                 default: 'Pending' },
  dateTime:    { type: Date },
  durationMins:{ type: Number, default: 60 },
  note:        { type: String },
  ratings:     [RatingSchema],
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
