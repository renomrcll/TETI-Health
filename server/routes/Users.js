const express = require('express');
const router = express.Router();
const {loginUser, getAllUsers, deleteUser, createUser, getUser, uploadAvatar, updateUser, changePassword} = require('../controllers/Users');
const checkAuth = require('../middleware/check-auth');

router.post('/login',loginUser)

router.post('/register', createUser);

router.post('/:id/avatar', checkAuth, uploadAvatar);

router.patch('/:id', checkAuth, updateUser);

router.patch('/:id/changepassword', checkAuth, changePassword);

router.get('/:id',checkAuth,getUser);

router.delete('/:id',checkAuth,deleteUser);

router.get('/',getAllUsers);

module.exports = router;