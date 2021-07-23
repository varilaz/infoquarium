const express = require('express');
const router = express.Router();
const multer = require("multer");

const checkAuthMiddleware = require('../middleware/checkout-auth');
const FilesUploadMiddleware = require('../middleware/files');

const ProductController = require('../controllers/products');



//const MIME_TYPE_MAP = require('../enums/mime_type');


// //FILE STORAGE COMPILATION
// const storage = multer.diskStorage({
//   destination: function(req, file, cb){
//     console.log(file + ' - file1')
//       cb(null, './uploads');
//   },
//   filename: function(req, file, cb){
//     console.log(file + ' - file2')
//     console.log(file)
//       cb(null, new Date().toISOString() + file.originalname)
//   }
// })

// const fileFilter = (req, file, cb) => {
//   if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4'){
//       cb(null, true);
//   } else {
//       cb(new Error('You can upload only png and jpg files'), false);
//   }
// }

// const upload = multer({
//   storage: storage,
//   limites: {
//       fileSize: 1024 * 1024 * 5
//   },
//   fileFilter: fileFilter
// });




//GET ALL PRODUCT
router.get('/', ProductController.get_all_product);



//GET ONE PRODUCT
router.get('/:productId', ProductController.get_one_product);



//CREATE PRODUCT
router.post('/', checkAuthMiddleware, FilesUploadMiddleware, ProductController.create_one_product);



//PATCH ONE PRODUCT
router.patch('/:productId', checkAuthMiddleware, FilesUploadMiddleware, ProductController.patch_one_product);



//DELETE
router.delete('/:productId', checkAuthMiddleware, ProductController.delete_one_product);



module.exports = router;
