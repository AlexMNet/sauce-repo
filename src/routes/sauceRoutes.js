const express = require('express');
const {
  getSauce,
  getAllSauces,
  createSauce,
  updateSauce,
  deleteSauce,
} = require('../controllers/sauceController');
const {
  authorization,
  // eslint-disable-next-line no-unused-vars
  checkIfAdmin,
} = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authorization, getAllSauces)
  .post(authorization, createSauce);

router
  .route('/:id')
  .get(authorization, getSauce)
  .patch(authorization, updateSauce)
  .delete(authorization, deleteSauce);

module.exports = router;
