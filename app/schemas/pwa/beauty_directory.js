var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var BeautyDirectorySchema = new Schema({
  name: String,
  crawlerId: String,
  photos: [{type: ObjectId, ref: "BeautyPhoto"}],
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

BeautyDirectorySchema.pre("save", function(next){
  if (this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }

  next();
});

BeautyDirectorySchema.statics = {
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
  },
  findByCrawlerId: function(crawlerId, cb) {
    return this
      .findOne({crawlerId: crawlerId})
      .exec(cb)
  }
}

module.exports = BeautyDirectorySchema