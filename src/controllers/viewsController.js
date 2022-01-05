const Sauce = require('../models/sauceModel');
const asyncHandler = require('../utils/asyncHandler');

exports.getOverview = asyncHandler(async (req, res, next) => {
  const sauces = await Sauce.find({
    user: '61c4dfc0d05360d123a0366e',
  }).populate('user');

  console.log(sauces);
  res.status(200).render('overview', {
    title: 'All Sauces',
    sauces,
  });
});
