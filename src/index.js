require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const sauceRouter = require('./routes/sauceRoutes');

//Middlware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//= =====================================================
// DATABASE
//= =====================================================
const dbSetup = require('./database/setup');

dbSetup();

//= =====================================================
// ROUTES
//= =====================================================

app.use('/sauces', sauceRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port: ${port}`);
});
