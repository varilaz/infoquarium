const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users')


//SIGN UP USERS
router.post('/signup', UsersController.user_signup);


//LOGIN USERS
router.post('/login', UsersController.user_login);


//SHOW USER
router.get('/', UsersController.user_show);


// DELETE USERS
router.delete('/:userId', UsersController.user_delete);



module.exports = router;
