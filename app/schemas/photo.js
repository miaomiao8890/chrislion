var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  name: String,
  originalName: String,
  url: String,
  albumId: String,
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

PhotoSchema.pre("save", function(next){
  if (this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }

  next();
});

PhotoSchema.statics = {
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

module.exports = PhotoSchema