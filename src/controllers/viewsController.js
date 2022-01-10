const Sauce = require('../models/sauceModel');
const asyncHandler = require('../utils/asyncHandler');
const { capitalize } = require('../utils/capitalize');

exports.getOverview = asyncHandler(async (req, res, next) => {
  const sauces = await Sauce.find({
    user: '61ca8c13b0501da2b4072592',
  }).populate('user');

  res.status(200).render('overview', {
    title: 'All Sauces',
    sauces,
    capitalize,
  });
});

exports.getLoginForm = asyncHandler(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login',
  });
});
