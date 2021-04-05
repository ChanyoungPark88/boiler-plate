const express = require('express')
const router = express.Router()
const path = require('path')
const { Video } = require("../models/video")
const { auth } = require("../middleware/auth")
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')
const { fileURLToPath } = require('url')

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, 'uploads/')
    },
    filename: (req,file,cb) => {
        cb(null,`${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req,file,cb) => {
        const ext = path.extname(file.originalname)
        if(ext!=='.mp4'){
            return cb(res.status(400).end('only mp4 is allowed'),false)
        }
        cb(null,true)
    }
})

const upload = multer({storage:storage}).single('file')
//=================================
//             Video
//=================================

router.post("/uploadfiles", (req, res) => {
    upload(req,res,err => {
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url: res.req.file.path, fileName: res.req.file.filename})
    })
})

router.post("/uploadVideo", (req, res) => {
    const video = new Video(req.body)
    video.save((err,doc)=>{
        if(err) return res.json({success:false, err})
        res.status(200).json({success:true})
    })
})

router.get("/getVideos", (req, res) => {
    Video.find().populate('writter').exec((err,videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, videos})
    })
})

router.post("/thumbnail", (req, res) => {
    let filePath = ''
    let fileDuration = ''
    // get video Duration
    ffmpeg.ffprobe(req.body.url,function(err,metadata){
        console.dir(metadata)
        console.dir(metadata.format.duration)
        fileDuration = metadata.format.duration
    })
    // Create thumbnail
    ffmpeg(req.body.url)
    .on('filenames',function(filename){
        console.log('Will generate '+filename.join(', '))
        console.log(filename)
        filePath = 'uploads/thumbnails/'+filename[0]
    })
    .on('end',function(){
        console.log('Screenshots taken')
        return res.json({success:true,url:filePath,fileDuration:fileDuration})
    })
    .on('error',function(err){
        console.error(err)
        return res.json({success:false,err})
    })
    .screenshot({
        count:3,
        folder:'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    })
})

module.exports = router
