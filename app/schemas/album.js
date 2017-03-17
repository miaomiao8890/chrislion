var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var AlbumSchema = new Schema({
  name: String,
  photos: [{type: ObjectId, ref: "Photo"}],
  summary: String,
  previewimg: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

AlbumSchema.pre("save", function(next){
  if (this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }

  next();
});

AlbumSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort("-meta.updateAt")
      .exec(cb)
  },
  findById: function(id, cb){
    return this
    .findOne({_id: id})
    .exec(cb)
  }
}

module.exports = AlbumSchema