const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sauce must have a name'],
    trim: true,
  },
});

module.exports = mongoose.model('Sauce', sauceSchema);
