const Sauce = require('../models/sauceModel');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const APIQueryOptions = require('../utils/APIQueryOptions');

//Get all sauces
exports.getAllSauces = asyncHandler(async (req, res, next) => {
  // console.log(req.query);
  const queryOptions = new APIQueryOptions(Sauce.find(), req.query)
    .filter()
    .sort()
    .projection()
    .pagination();

  const sauces = await queryOptions.query;

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
  const newSauce = await Sauce.create(req.body);

  res.status(200).json({
    status: 'Successful',
    data: {
      newSauce,
    },
  });
});

//Fetch a single sauce
exports.getSauce = asyncHandler(async (req, res, next) => {
  const sauce = await Sauce.findById(req.params.id);

  if (!sauce) return next(new AppError(404, 'No Sauce found with that ID!'));

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
