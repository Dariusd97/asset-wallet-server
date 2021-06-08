const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const ReportEntry = sequelize.define('reportEntry', {
        expectedValue : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        return : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        probBreakeven : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        beta : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        sharpe : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        campReturn : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        stockName : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return ReportEntry
}