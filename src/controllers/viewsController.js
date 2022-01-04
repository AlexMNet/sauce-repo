const Sauce = require('../models/sauceModel');
const asyncHandler = require('../utils/asyncHandler');

exports.getOverview = asyncHandler(async (req, res, next) => {
  const sauces = await Sauce.find({}).populate('user');

  res.status(200).render('overview', {
    title: 'All Sauces',
    sauces,
  });
});
