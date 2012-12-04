var Tile = new Schema({
  tile_id: int,
  mosaic_id: int,
  x: int,
  y: int,
  title: String,
  author: String,
  uploaded: Date
});