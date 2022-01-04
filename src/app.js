require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const sauceRouter = require('./routes/sauceRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewsRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/globalErrorHandler');

//Middlware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
//View Routes
app.use('/', viewRouter);
//Sauce routes
app.use('/api/sauces', sauceRouter);
//User routes
app.use('/api/users', userRouter);

//Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(404, 'Sorry the page you are looking for cannot be found'));
});

app.use(globalErrorHandler);

module.exports = app;
