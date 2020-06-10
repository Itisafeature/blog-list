const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A username is required'],
    min: 3,
    unique: [true, 'This username already exists'],
  },
  name: String,
  password: String,
  blogs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.password;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
