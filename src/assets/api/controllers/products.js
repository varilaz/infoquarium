const mongoose = require('mongoose');

const Product = require('../models/product');



// GET ALL PRODUCTS
exports.get_all_product = (req, res, next) => {
    Product.find()
    .select('name price _id productImage description categories creator')
    .populate('creator')
    .then(result => {
        const response = {
            count: result.length,
            products:  result.map( doc => {
              //console.log(doc)
                return{
                    name: doc.name,
                    price:doc.price,
                    id: doc._id,
                    productImage: doc.productImage,
                    description: doc.description,
                    categories: doc.categories,
                    creator: doc.creator,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
  //      if(result >= 0){
            res.status(200).json(response);
        // } else {
        //     res.status(404).json({
        //         message: "NO entries found!!!"
        //     })
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: "No entry found!"
        })
    })

}




//GET ONE PRODUCT
exports.get_one_product = (req, res, next) => {

    const id = req.params.productId;
    Product.findById(id)
    .select('name price id productImage description categories creator')
    //.exec()
    .then( doc => {
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost/products'
                }
            })
        } else {
            res.status(404).json({
                message: "No entry found for ID!"
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });

}




//CREATE ONE PRODUCT
exports.create_one_product = (req, res, next) => {

  let category = req.body.categories;
  let categoriesArray = [];
  let valuesOfCategories = category.split(',');
  categoriesArray.push(...valuesOfCategories);
  //console.log(req.body.userId + ' - ' + 'creator')
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path,
        description: req.body.description,
        categories: categoriesArray,
        creator: req.body.userId
    })

    product.save()
    .then(result => {
      console.log(result)
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result.id,
                productImage: result.productImage,
                description: result.description,
                categories: result.categories,
                creator:result.creator,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result.id
                }
            }
        })
    })
    .catch(err => {
        console.log(err + "106-os sor ");
        res.status(500).json({
            error: err
        })
    });
}




//PATCH ONE PRODUCT
exports.patch_one_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    let imagePath;
    let categoriesOfProduct;

    if (req.file){
      let category = req.body.categories;
      let categoriesArray = [];
      let valuesOfCategories = category.split(',');
      categoriesArray.push(...valuesOfCategories);
      categoriesOfProduct = categoriesArray;
      imagePath = req.file.path;
    } else {
      imagePath = req.body.image.slice(10);
      categoriesOfProduct = req.body.categories
    }

    const product = {
      name: req.body.name,
      price: req.body.price,
      productImage: imagePath,
      description: req.body.description,
      categories: categoriesOfProduct,
      creator: req.body.creator
  }

    for(let [key, value] of Object.entries(product)) {
        updateOps[key] = value;
    }

    Product.updateOne({_id: id }, { $set: updateOps })
    .then(result => {
      console.log(result)
        res.status(200).json({
            message: "Product updSated",
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}




//DELETE ONE PRODUCT
exports.delete_one_product =   (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
        _id: id
    })
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type:'POST',
                url: 'http://localhost/3000/products' + id,
                data: {
                    name: 'String',
                    body: 'Number'
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}
