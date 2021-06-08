const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const DailyStockPrices = sequelize.define('dailyStockPrice', {
        data : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        price : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return DailyStockPrices
}