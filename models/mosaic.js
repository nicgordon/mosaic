var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var mosaicSchema = new Schema({
  title: String,
  author: { type: String, default: 'Anonymous' },
  description: String,
  image: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mosaic', mosaicSchema);