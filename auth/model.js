const Sequelize = require('sequelize')
const sequelize = require('../db')

const User = sequelize.define('users', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  top_score: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
}, {
  timestamps: false,
  tableName: 'users'
})

module.exports = User