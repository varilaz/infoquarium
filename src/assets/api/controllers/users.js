const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');



//SIGNUP USER
exports.user_signup = (req, res, next) => {

    User.find({email:req.body.email})
    .then(user => {
        if(user.length >= 1){
            return res.status(409).json({
                message: 'This mail exists!'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    console.log(err + " 23-as sor")
                    return res.status(500).json({
                        error:err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    })
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created',
                            result: result
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        console.log(err + " 42-as sor")
                        res.status(500).json({
                            error:err
                        })
                    })
                }
        });
      }
    })
}



// LOGIN USER
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: "Auth failed!"
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: "Auth failed!"
                })
            }
            if(result){
                console.log(user[0]._id)
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1h",
                }
                )
                return res.status(200).json({
                    message: 'Auth successfull!',
                    token: token,
                    expiresIn: 3600,
                    userId: user[0]._id,
                    email: user[0].email
                });
            }
            res.status(401).json({
                message: "Auth failed!"
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
}



//SHOW USER
exports.user_show = (req, res, next) => {
  User.find()
  .then(result => {
    console.log(result);
    const response = {
      count: result.length,
      users:  result.map( doc => {
          return{
              id: doc.id,
              username: doc.username,
              email: doc.email,
              password: doc.password
          }
      })
    }
    res.status(200).json(response);
  })
  .catch(err => {
    res.status(500).json({
      message: "user show failed"
    })
  })
}


// DELETE USER
exports.user_delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .then(result => {
        res.status(200).json({
            message: 'User deleted!'
        });
    })
    .catch(err => {
     console.log(err);
     res.status(500).json({
            error: err
        })
    })
 }
