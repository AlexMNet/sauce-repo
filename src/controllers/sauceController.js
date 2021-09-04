const Sauce = require('../models/sauceModel');

exports.getAllSauces = async (req, res, next) => {
  const sauces = await Sauce.find({});

  res.status(200).json({
    status: 'Successful',
    results: sauces.length,
    data: {
      sauces,
    },
  });
};

exports.createSauce = async (req, res, next) => {
  const sauce = await Sauce.create({
    name: req.body.name,
  });

  res.status(200).json({
    status: 'Successful',

    data: {
      sauce: sauce,
    },
  });
};
