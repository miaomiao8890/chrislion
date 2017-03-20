var mongoose = require("mongoose");

var BeautyDirectorySchema = require("../../schemas/pwa/beauty_directory");
var BeautyDirectory = mongoose.model("BeautyDirectory", BeautyDirectorySchema, 'beauty_directories');

module.exports = BeautyDirectory;