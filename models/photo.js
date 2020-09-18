var mongoose = require("mongoose");

var photoSchema = new mongoose.Schema({
	filePath: String,
});

module.exports = mongoose.model("Photo", photoSchema);