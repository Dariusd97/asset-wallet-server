const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const FinanciaGoal = sequelize.define('financialGoal', {
        goal : {
            type: Sequelize.STRING(255),
            allowNull : true
        }
    })
    return FinanciaGoal
}