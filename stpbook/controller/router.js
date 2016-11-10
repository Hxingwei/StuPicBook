var files = require("../model/fileMgr.js");
var formidable = require("formidable");
var path = require("path");
var sd = require("silly-datetime");
var fs = require("fs");
var db = require("../model/dbutils.js");
var util = require('util');

var showAllFolders = function(req,res){


    files.getAllFolder(function(folders){
      console.log("folders2:"+folders);
      res.render("show_all_folders",{
         pageTitle:"同学录相册 所有相册",
         folders:folders
      });
    });

};

var showNotFoundErr = function(req,res){
    res.render("404",{
       pageTitle:"同学录相册 链接访问失败!"
    });
};

var showPicsInFolder = function(req,res){
    var owner = req.params.folderOwner;

    // files.getAllPicsInFolder(owner,function(pics){
    //   console.log(pics);
    //   res.render("show_folder_pics",{
    //       pageTitle:"同学录相册  "+owner+"的相册",
    //       folderOwner:owner,
    //       folderPics:pics
    //   });
    // });

    files.getAllPicsInFolderFromDB(owner,function(err,result){
      console.log("data:"+result);
      console.log(util.inspect(result));
      res.render("show_folder_pics",{
          pageTitle:"同学录相册  "+owner+"的相册",
          folderOwner:owner,
          folderPics:result
      });
      res.end();
    });

};

var showWholePic = function(req,res){

   var owner = req.params.folderOwner;
   var pic = req.params.pic;

   db.query("comments",
            {"pic_name":pic},
            10,
            1,
            {"comment_time":-1},
            function(err,result){
              res.render("show_whole_pic",{
                 pageTitle:"同学录相册  "+owner+"的相册",
                 folderOwner:owner,
                 pic:pic,
                 comments:result
              });
            }
          );

}

var showUploadPage = function(req,res){

  files.getAllFolder(function(folders){
    res.render("upload_pic",{
       pageTitle:"同学录相册 上传相片",
       folderOwners:folders
    });
  });

}

var uploadPic = function(req,res){

  var form = new formidable.IncomingForm();
  //预先设置要上传到的文件夹
  form.uploadDir = path.join(__dirname,"../upload/"+req.params.folderOwner);
  form.encoding="utf-8";
  form.keepExtensions=true;

  form.parse(req, function(err, fields, files) {

     var folderOwner = fields.folderOwner;
     var newPic =  files.pic;
     console.log("path:"+files.pic.path);

     //  var oldPath = path.join(__dirname,"/../")+files.pic.path;
     var extName = path.extname(files.pic.path);
     var newPicName = sd.format(new Date(),'YYYYMMDDHHmmss');
     var newPath = path.join(__dirname,"/../upload/")
                             +req.params.folderOwner+"/"+newPicName+extName;
     console.log("newpATH:"+newPath);
     fs.rename(files.pic.path,newPath);

     //保存信息到数据库
     db.insertOne("stp",
                  {"pic_name":newPicName+extName,
                   "folder_owner":fields.folderOwner,
                   "pic_desc":fields.picDesc,
                   "upload_time":new Date()
                  },
                  function(err){
                    if(err){
                      res.send(err);
                      return;
                    }
                    else
                      res.end("upload ok!");
                  });
  });

}

var removePic = function(req,res){
   var owner = req.params.folderOwner;
   var pic = req.params.pic;

   files.delPic(
       path.join(__dirname,"/../upload/")+owner+"/"+pic,
       function(){
          res.send("remove pic ok!");
       }
   );
}

var makeComment = function(req,res){

   var form = new formidable.IncomingForm();
   form.parse(req,function(err,fields,files){
      db.insertOne("comments",
           {"pic_name":fields.pic,"user":fields.user,"comment":fields.comment,"comment_time":new Date()},
           function(err,result){
              if(err){
                res.json({"result":1});
              }
              else
                res.json({"result":0});
           }
      );
   });

}

var loadComment = function(req,res){

      var pic = req.params.pic;

      db.query("comments",
               {"pic_name":pic},
               10,
               1,
               {"comment_time":-1},
               function(err,result){
                  res.json(result);
               }
             );
}


exports.loadComment = loadComment;
exports.makeComment = makeComment;
exports.showAllFolders = showAllFolders;
exports.showNotFoundErr = showNotFoundErr;
exports.showPicsInFolder = showPicsInFolder;
exports.showWholePic = showWholePic;
exports.showUploadPage = showUploadPage;
exports.uploadPic = uploadPic;
exports.removePic = removePic;
