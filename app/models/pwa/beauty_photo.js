var mongoose = require("mongoose");

var BeautyPhotoSchema = require("../../schemas/pwa/beauty_photo");
var BeautyPhoto = mongoose.model("BeautyPhoto", BeautyPhotoSchema, 'beauty_photos');

module.exports = BeautyPhoto;