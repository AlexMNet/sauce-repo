const mongoose = require('mongoose');

module.exports = function () {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('LOCAL MONGO CONNECTION OPEN!!!');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log('LOCAL MONGO CONNECTION ERROR!!!!');
      // eslint-disable-next-line no-console
      console.log(err);
    });
};
