const mongoose = require('mongoose');

const megaSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  drawID: String,
  result: [Number],
  date: Date,
})

const MegaFourFive = mongoose.model('megafourfive', megaSchema);

module.exports = MegaFourFive;