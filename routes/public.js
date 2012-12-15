var fs = require("fs"),
    Canvas = require('canvas'),
    Image = Canvas.Image,

    // Models
    Tile = require('../models/tile');

exports.upload = function(req, res){
  res.render("upload", { title: "Upload", mosaic_id: req.query.mosaic });
};


function process(req, res) {

  if (!req.body.mosaic_id) {
    res.send('Oops, we couldn\'t detect which Mosaic this your image was intended for. Please try again');
    return;
  };

  if (!req.files.tile_image) {
    res.send('No image was selected for upload.');
    return;
  };

  var mosaicId = req.body.mosaic_id,
    inputPath = req.files.tile_image.path,
    filename = Date.now(),
    localPath = "./public/mosaics/" + mosaicId + "/" + filename + ".png";

  fs.rename(inputPath, localPath, function(err) {
    if (err) throw err;
    
    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    fs.unlink(inputPath, function() {
      if (err) throw err;
    });


    // Determine the main colour represented by the image uploaded
    var img = new Image;

    img.onerror = function(err) {
      throw err;
    };

    img.onload = function () {

      // TODO - Find a far more accurate method of determining the dominant colour
      // For now, just resize the image to 1 pixel x 1 pixel and see what colour you end up with
      var canvas = new Canvas(1, 1),
        ctx = canvas.getContext('2d');

      ctx.drawImage(img,0,0,1,1);

      // Get the image colour information
      var data = ctx.getImageData(0, 0, 1, 1).data;    
      var red, blue, green, alpha, hexaString, hexa, hex, output = '';

      red = data[0];
      green = data[1];
      blue = data[2];
      alpha = data[3];

      hexaString = (red * 0x1000000 + green * 0x10000 + blue * 0x100 + alpha).toString(16);
      hexa = '#' + ('0000000'.substr(0, 8 - hexaString.length)) + hexaString;
      hex = hexa.substr(0, 7);

        // var tile = new Tile({
        //   mosaic_id: mosaic._id,
        //   x: col,
        //   y: row,
        //   colour: hex
        // });

        // tile.save();

        console.log('hex is : ' + hex);


      // Find the tiles in the mosaic specified that are of the same colour in the image uploaded
      // TODO - Make this a range of similar colours, but for now only search for exact
      Tile.find({ mosaic_id: mosaicId, colour: hex }, function (err, tiles) {
        if (tiles.length === 0) {
          res.send('Unfortunately there were no empty spaces in this mosaic of that colour. Check the listogram before uploading to see what is still needed!');
        } else {

          var selectedIndex = Math.floor(Math.random() * tiles.length),
            selectedTile = tiles[selectedIndex];

          res.send('We found a tile! It is in position ' + selectedTile.x + ',' + selectedTile.y);
        }
      });
    };

    img.src = localPath;
  });
};

function confirm(req, res) {


};




function receive(req, res) {
  console.log("Request handler 'upload' was called.");

  // get the temporary location of the file
  var tmp_path = req.files.photo.path;
  // set where the file should actually exists - in this case it is in the "images" directory
  var target_path = './public/images/' + req.files.photo.name;
  // move the file from the temporary location to the intended location
  fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;
      // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
      fs.unlink(tmp_path, function() {
          if (err) throw err;
          res.send('File uploaded to: ' + target_path + ' - ' + req.files.photo.size + ' bytes');
      });
  });
};

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("/tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    }
  });
};

exports.receive = receive;
exports.show = show;
exports.process = process;