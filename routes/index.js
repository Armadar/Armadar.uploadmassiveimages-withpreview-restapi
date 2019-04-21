const express = require('express')
const multer = require('multer')
//const fileType = require('file-type')
const fs = require('fs')
const router = express.Router()
const path = require('path');
const sharp = require('sharp');

const DIR = './uploads';

function createFileName(req, multerFile) {
    return req.body.parentId + '_' + req.body.id + path.extname(multerFile.originalname);
}

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, DIR);
    },
    filename: function (req, file, callback) {
        callback(null, createFileName(req, file));
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 10000000, files: 1 },
    fileFilter: (req, file, callback) => {

        if (!file.originalname.match(/\.(jpg|jpeg|JPG|png)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')

router.post('/images/upload', (req, res) => {

    upload(req, res, function (err) {
        if (err) {
            res.status(400).json({ message: err.message })
        } else {
            ////////////////////////////////////////////////////////////////////////
            if (req.file) {
                sharp(DIR + '/' + req.file.filename)
                    .resize(200, null)
                    .toFile(DIR + '/resizedimages/' + req.file.filename, function (err) {
                        if (err) { res.status(500).json({ message: err.message }) }
                    });
            }
            ////////////////////////////////////////////////////////////////////////
            console.info(req.body);
            res.status(200).json({ message: 'Image Uploaded Successfully !' })
        }
    })
})

router.get('/images/:imagename', (req, res) => {
    /*
        let imagename = req.params.imagename
        let imagepath = __dirname + "/uploads/" + imagename
        let image = fs.readFileSync(imagepath)
        let mime = fileType(image).mime
    
        res.writeHead(200, {'Content-Type': mime })
      res.end(image, 'binary')
      */
})

/*
app.use(app.router);
routes.initialize(app);

app.use((err, req, res, next) => {

    if (err.code == 'ENOENT') {
        
        res.status(404).json({message: 'Image Not Found !'})

    } else {

        res.status(500).json({message:err.message}) 
    } 
})
*/

module.exports = router;