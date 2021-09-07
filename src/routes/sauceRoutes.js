const express = require('express');
const sauceController = require('../controllers/sauceController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(sauceController.getAllSauces)
  .post(sauceController.createSauce);

router
  .route('/:id')
  .get(sauceController.getSauce)
  .patch(
    authController.authenticateUser,
    authController.checkIfAdmin,
    sauceController.updateSauce
  )
  .delete(
    authController.authenticateUser,
    authController.checkIfAdmin,
    sauceController.deleteSauce
  );

module.exports = router;
