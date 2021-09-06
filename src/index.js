require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const sauceRouter = require('./routes/sauceRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');

//Middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Console whether app is running in development/production mode
// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);

//= =====================================================
// DATABASE
//= =====================================================
const dbSetup = require('./database/setup');

dbSetup();

//= =====================================================
// ROUTES
//= =====================================================
//Sauce routes
app.use('/sauces', sauceRouter);
//User routes
app.use('/users', userRouter);

//Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(404, 'Sorry the page you are looking for cannot be found'));
});

app.use(globalErrorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${port}`);
});