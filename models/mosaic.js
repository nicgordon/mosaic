var Mosaic = new Schema({
  mosaic_id: int,
  title: String,
  author: String,
  created: { type: Date, default: Date.now }
});