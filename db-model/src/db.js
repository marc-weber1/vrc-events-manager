const Sequelize = require('sequelize')


const sequelizeInstance = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
  },
)

exports.sq = sequelizeInstance;
exports.Event = require('./event');
exports.Group = require('./group');
exports.User = require('./user');
exports.Membership = require('./membership');
exports.Subscription = require('./subscription');
exports.Instance = require('./instance');