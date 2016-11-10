var express = require("express");
var path = require("path");
var app = express();
var router = require("./controller/router.js");

app.set("view engine","jade");
app.set("views",__dirname+"/views/pages");
app.locals.pretty = true;

app.use(express.static("public"));
// http://localhost/鲁门/01.jpg
app.use("/picdb",express.static("upload"));

// 显示欢迎首页
app.get("/",router.showAllFolders);
app.get("/favicon.ico",function(req,res){
   res.end();
});
app.get("/uploadPic",router.showUploadPage);
app.post("/comment",router.makeComment);
app.get("/:pic/comment",router.loadComment);
app.post("/:folderOwner/new",router.uploadPic);
app.get("/:folderOwner",router.showPicsInFolder);
app.get("/:folderOwner/:pic/remove",router.removePic);
app.get("/:folderOwner/:pic",router.showWholePic);

app.use(router.showNotFoundErr);

app.listen(80,function(){
  //console.log(__dirname);
  //C:\360disk\course-ware\nodejs-example\upload
  //console.log(path.join(__dirname,"/../upload"));
  console.log("student pic books is running at port 80 ok!");
});

// __dirname是当前文件的绝对路径
// . 是node命令执行时所在的目录。
