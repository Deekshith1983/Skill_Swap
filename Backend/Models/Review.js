const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  reviewer:  { type: Schema.Types.ObjectId, ref: 'User' },
  reviewee:  { type: Schema.Types.ObjectId, ref: 'User' },
  session:   { type: Schema.Types.ObjectId, ref: 'Session' },
  score:     { type: Number, min: 1, max: 5, required: true },
  feedback:  { type: String, maxlength: 300 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = ReviewSchema;
