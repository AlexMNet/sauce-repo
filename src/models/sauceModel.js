const mongoose = require('mongoose');

const { Schema } = mongoose;

const sauceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Sauce must have a name'],
      trim: true,
      unique: true,
    },
    brandName: {
      type: String,
      required: [true, 'Sauce must have a name'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Sauce must have a rating between 1 and 5'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sauce', sauceSchema);
