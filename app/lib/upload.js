var qiniu = require("qiniu");

//设置 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '9akcIR-MgTXUf9uX4c-9RoPcdOdV0C4LdCTo0kSw';
qiniu.conf.SECRET_KEY = 'wUwLi96RmHvpmbvuNA3Omm_GSBZeRfNOSLkmBGCp';

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile, cb) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);  
        cb(ret);     
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

function qiniuUpload(file, cb) {
  //要上传的空间
  var bucket = 'chrislionalbum';

  //上传到七牛后保存的文件名
  var tmpAry = file.path.split('/');
  var key = tmpAry[tmpAry.length-1];

  //生成上传 Token
  var token = uptoken(bucket, key);

  //要上传文件的本地路径
  var filePath = file.path;

  //调用uploadFile上传
  uploadFile(token, key, filePath, cb);
}

module.exports = qiniuUpload;
