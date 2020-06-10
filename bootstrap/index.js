const connectDb  = require('./database');

const bootstrap  = () => {
  connectDb();
}

module.exports = bootstrap;