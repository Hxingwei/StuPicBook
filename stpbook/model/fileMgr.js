var fs = require("fs");
var path = require("path");
var db = require("./dbutils.js");

// 获得所有文件夹的名称列表
exports.getAllFolder = function(callback){

    //  相册文件夹名称数组
     var folders = [];

     console.log("fileMgr:"+__dirname);

     //c:\abc\..\upload => c:\upload
     fs.readdir(path.join(__dirname,"/../upload"),function(err,files){
        // 通过readDir得到的文件名称数组中可能包含文件信息，而不是目录，在这里我们需要做过滤，以确保得到的必须都是目录的名称。

        // for(var i=0;i<files.length;i++)
        //   fs.stat("./upload/"+files[i],function(err,stats){
        //      if(stats.isDirectory())
        //          folders.push(files[i]);
        //   });

        (function iterator(idx){
          if(idx==files.length) {
             console.log(folders);
             callback(folders);
             return;
          }
          fs.stat(path.join("./upload/",files[idx]),function(err,stats){
             if(stats.isDirectory())
                 folders.push(files[idx]);
             iterator(++idx);
          });
        })(0);

     });

};

exports.getAllPicsInFolderFromDB = function(folderOwner,callback){
   //collectionName,filter,pageSize,pageNo,sort,callback
    db.query("stp",
             {"folder_owner":folderOwner},
             12,
             1,
             {"upload_time":-1},
             callback
            );

};

// 获得某个文件夹中的所有的图片文件的名字列表
exports.getAllPicsInFolder = function(folderOwner,callback){

    var pics = [];
    var folderPath = path.join(__dirname,"/../upload/")+folderOwner;
    //console.log(folderPath);

    fs.readdir(folderPath,function(err,files){

         (function iterator(idx){

             console.log("folderPath:"+folderPath);
             console.log("files:"+files.length);
             if(idx==files.length){
                callback(pics);
                return;
             }

             fs.stat(path.join(folderPath,"/")+files[idx],function(err,stats){
                if(stats.isFile())
                    pics.push(files[idx]);
                iterator(++idx);
             })

         })(0);

    });

}

//删除图片
exports.delPic = function (filePath, callback){
    fs.unlink(filePath,function(){
       callback();
    });
}
