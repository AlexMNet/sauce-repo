const express = require('express');
const sauceController = require('../controllers/sauceController');

const router = express.Router();

router
  .route('/')
  .get(sauceController.getAllSauces)
  .post(sauceController.createSauce);

module.exports = router;
