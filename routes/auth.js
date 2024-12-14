const express = require('express');
const {register, login, updateDetails, deleteUser, getUser, getUsers, updatePassword, forgotPassword } = require('../controller/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/:id', updateDetails);
router.delete('/:id', deleteUser);
router.get('/users', getUsers);
router.get('//users/:id', getUser);
router.put('/updatePassword/:id', updatePassword);
router.post('/forgotPassword', forgotPassword);

 

module.exports = router;