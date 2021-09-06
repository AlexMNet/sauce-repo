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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sauce', sauceSchema);
