const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Returns = sequelize.define('return', {
        stockName : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        seValue : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        mrValue : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return Returns
}