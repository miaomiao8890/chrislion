var mongoose = require("mongoose");

var AlbumSchema = require("../schemas/album");
var Album = mongoose.model("Album", AlbumSchema);

module.exports = Album;