const express = require('express');
const router = express.Router();
const {loginUser, createUser, getUser, uploadAvatar,updateUser} = require('../controllers/Users');
const checkAuth = require('../middleware/check-auth');

router.post('/login',loginUser)

router.post('/register', createUser);

router.post('/:id/avatar', checkAuth, uploadAvatar);

router.patch('/:id', checkAuth, updateUser);

router.get('/:id',checkAuth,getUser);

module.exports = router;