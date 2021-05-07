const express = require("express");
const router = express.Router();
const fs = require("fs");
const util = require("util");
const fileUpload = require("express-fileupload");
const path= require("path");
const mime=require("mime");
/*const multer= require("multer");
const storage=multer.diskStorage({
  destination:  "../uploads",
  file: function(req, file, cb) {
    console.log("md5:"+req.files.file.md5);
    cb(null, req.files.file.md5 + path.extname(file.originalname));
  }
});
const upload=multer({storage: storage}).single("file");
const fileFilter= (req, file, cb) => {
  if(file.mimetype === "video/mp4" || file.mimetype === "video/MOV"){
    cb(null,true);
  }else{
    cb(null, false);
  }
};*/
router.get("/", (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  const videoPath = "./videos/nehTutorial.mp4";
  const videoSize = fs.statSync(videoPath).size;
if(range){
  // get video stats (about 61MB)
 

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const parts = range.replace(/bytes=/, "").split("-");
  const start= parseInt(parts[0],10);
  const end = parts[1] ? parseInt(parts[1],10): videoSize-1;
  
  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
}else{
  const headers = {

    "Content-Length": videoSize,
    "Content-Type": "video/mp4",
  }
  res.writeHead(200,headers);
  fs.createReadStream(videoPath).pipe(res);
}
});
router.get("/1", (req, res) => {
  // Ensure there is a range given for the video
  var video_id=req.params.id;
  const range = req.headers.range;
  
    const videoPath = "./videos/top.MOV";
  
  
  const videoSize = fs.statSync(videoPath).size;
if(range){
  // get video stats (about 61MB)
 

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const parts = range.replace(/bytes=/, "").split("-");
  const start= parseInt(parts[0],10);
  const end = parts[1] ? parseInt(parts[1],10): videoSize-1;
  
  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
}else{
  const headers = {

    "Content-Length": videoSize,
    "Content-Type": "video/mp4",
  }
  res.writeHead(200,headers);
  fs.createReadStream(videoPath).pipe(res);
}
});
router.post("/", async (req, res) => {
  try {
   // console.log(req.files.file);
    const file = req.files.file;
    
    console.log(file.filename);
    const fileName = file.name;
    const size = file.data.length;
    const extension = path.extname(fileName);

    const allowedExtensions = /mp4|MOV/;

    if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
    if (size > 10000000) throw "File must be less than 10MB";

    const md5 = file.md5;
    const URL = "uploads/" + md5 + extension;

    await util.promisify(file.mv)("../" + URL);
    
    res.send({
      result_code: "ok",
      message: "File uploaded successfully!",
    });
    //console.log(req.rawHeaders);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      result_code: "error",
      message: err,
    });
  }
});
module.exports = router;