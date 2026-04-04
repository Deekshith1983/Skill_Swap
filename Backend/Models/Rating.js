const mongoose = require('mongoose');
const { Schema } = mongoose;

const RatingSchema = new Schema({
  from:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  session:  { type: Schema.Types.ObjectId, ref: 'Session' },
  score:    { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = RatingSchema;
