require('dotenv').config();

const { Sequelize } = require('sequelize');

const UsersModel = require('./models/Users');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    timestamps: true,
  },
  logging: false,
});

sequelize.sync({ alter: true, force: true }).then(() => {
  console.log(`Database & tables created!`);
});

const Users = UsersModel(sequelize, Sequelize);

try {
  sequelize.authenticate();
  console.log('Connection for db has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

module.exports = { sequelize, Users };
