const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewsController.getOverview);

router.route('/login').get(viewsController.getLoginForm);

module.exports = router;
