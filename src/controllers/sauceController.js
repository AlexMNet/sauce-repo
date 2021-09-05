const Sauce = require('../models/sauceModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

//Get all sauces
exports.getAllSauces = asyncHandler(async (req, res, next) => {
  const search = req.query.search
    ? { name: new RegExp(req.query.search, 'i') }
    : {};

  const sauces = await Sauce.find(search);

  res.status(200).json({
    status: 'Successful',
    results: sauces.length,
    data: {
      sauces,
    },
  });
});

//Create a sauce
exports.createSauce = asyncHandler(async (req, res, next) => {
  const sauce = await Sauce.create({
    name: req.body.name,
  });

  res.status(200).json({
    status: 'Successful',
    data: {
      sauce,
    },
  });
});

//Fetch a single sauce
exports.getSauce = asyncHandler(async (req, res, next) => {
  const sauce = await Sauce.findById(req.params.id);

  res.status(200).json({
    status: 'Successful',
    data: {
      sauce,
    },
  });
});

//Update a sauce
exports.updateSauce = asyncHandler(async (req, res, next) => {
  const sauce = await Sauce.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!sauce) {
    return next(new AppError(404, 'Sauce cannot be found'));
  }

  res.status(200).json({
    status: 'Successful',
    data: {
      sauce,
    },
  });
});

//Delete Sauce
exports.deleteSauce = async (req, res, next) => {
  const sauce = await Sauce.findByIdAndDelete(req.params.id);

  if (!sauce) {
    return next(new AppError(404, 'Sauce cannot be found...'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
