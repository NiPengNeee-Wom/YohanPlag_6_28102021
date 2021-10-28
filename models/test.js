const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
});

module.exports = mongoose.model('Test', testSchema);