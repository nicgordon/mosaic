var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var tileSchema = new Schema({
  mosaic_id: ObjectId,
  x: Number,
  y: Number,
  colour: String,
  title: String,
  author: String,
  title: String,
  image: String,
  uploaded: Date
});

module.exports = mongoose.model('Tile', tileSchema);