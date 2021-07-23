const multer = require("multer");

const MIME_TYPE_MAP = require('../enums/mime_type');


//FILE STORAGE COMPILATION
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname.toLocaleLowerCase().split(' ').join('-'))
    }
})

const fileFilter = (req, file, cb) => {
    //if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4'){
      if(MIME_TYPE_MAP){
        cb(null, true);
    } else {
        cb(new Error('You can upload only png and jpg files'), false);
    }
}

const upload = multer({
    storage: storage,
    limites: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});



module.exports = upload.single('productImage');
