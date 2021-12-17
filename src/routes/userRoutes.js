const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .post('/signup', authController.signup)
  .post('/login', authController.login)
  .get('/logout', authController.authorization, authController.logout)
  .patch(
    '/updatePassword',
    authController.authorization,
    authController.updatePassword
  )
  .post('/forgotPassword', authController.forgotPassword)
  .patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(userController.getAllUsers);

module.exports = router;
