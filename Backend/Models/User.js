const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReviewSchema = require('./Review');

const UserSchema = new Schema({
  name:            { type: String, required: true },
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String, required: true, bcrypt: true },
  mobile:          { type: String, required: true },
  college:         { type: String, required: true },
  profilePic:      { type: String, default: '' },
  bio:             { type: String, maxlength: 500 },
  skillsOffered:   [{ type: String }],
  skillsNeeded:    [{ type: String }],
  experienceLevel: { type: String, enum: ['Beginner','Intermediate','Advanced'], required: true },
  rating:          { type: Number, default: 0, min: 0, max: 5 },
  reviews:         [ReviewSchema],
  sessionHistory:  [{ type: Schema.Types.ObjectId, ref: 'Session' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
