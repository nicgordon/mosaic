var fs = require("fs");

exports.upload = function(req, res){
  res.render("upload", { title: "Upload"});
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