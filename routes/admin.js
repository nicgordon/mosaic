var TARGET_PIXEL_COUNT = 2000,
	fs = require("fs"),
	Canvas = require("canvas"),
	Image = Canvas.Image;

function upload (req, res) {
	res.render("admin/upload", { title: "Admin Upload Area" });
};

function process(req, res) {
		
	if (!req.files.mosaic_image) {
		res.send('No image was selected for upload.');
		return;
	};

	var inputPath = req.files.mosaic_image.path,
		filename = Date.now(),
		localPath = "./public/images/" + filename + "_orig.png",
		resizedPath = "./public/images/" + filename + ".png";

	fs.rename(inputPath, localPath, function(err) {
		if (err) throw err;
		
		console.log('File uploaded to: ' + localPath + ' - ' + req.files.mosaic_image.size + ' bytes');

		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(inputPath, function() {
			if (err) throw err;
			console.log('Original uploaded file removed.');
		});


		var img = new Image;

		img.onerror = function(err) {
			throw err;
		};

		img.onload = function () {
			console.log('Width: ' + img.width);

			var origPixelCount = img.width * img.height,
				imageRatio = img.width / img.height,
				resizeFactor = Math.sqrt(TARGET_PIXEL_COUNT / origPixelCount),
				newWidth = Math.round(img.width * resizeFactor),
				newHeight = Math.round(img.height * resizeFactor);

			console.log("New width: " + newWidth + ", New height: " + newHeight);

			// Resize the image
			var canvas = new Canvas(newWidth, newHeight),
				ctx = canvas.getContext('2d');

			ctx.drawImage(img,0,0,newWidth,newHeight);

			// Save the resized image
			canvas.toBuffer(function(err, buf){
				fs.writeFile(resizedPath, buf, function(){
					console.log('Image resized.');
					res.render("admin/confirm", { title: "Admin Upload Area - More Details", imageName: filename + '.png' });
				});
			});
		};

		img.src = localPath;
	});
};

function confirm(res, req) {

	debugger;

	// Filename is received from the post variables
	var filename = req.filename,
		img = new Image;

	img.onerror = function(err) {
		throw err;
	};

	img.onload = function () {
		// Resize the image
		var canvas = new Canvas(newWidth, newHeight),
			ctx = canvas.getContext('2d');

		ctx.drawImage(img,0,0,img.width,img.height);

		// Get the image colour information
		var data = ctx.getImageData(0, 0, newWidth, newHeight).data;		
		var red, blue, green, alpha, hexaString, hexa, hex, output = "", row = 1, col = 0;

		for (i = 0; i < data.length; i += 4) {

			if (col === newWidth) {

				col = 0;
				row++;
			}

			col++;

			red = data[i];
			green = data[i + 1];
			blue = data[i + 2];
			alpha = data[i + 3];

			hexaString = (red * 0x1000000 + green * 0x10000 + blue * 0x100 + alpha).toString(16);
			hexa = '#' + ('0000000'.substr(0, 8 - hexaString.length)) + hexaString;
			hex = hexa.substr(0, 7);
			output += "row: " + row + ", col: " + col + " - " + hex + "<br />";

		}

		res.send(output);

	};

	img.src = localPath;

};

exports.upload = upload;
exports.process = process;