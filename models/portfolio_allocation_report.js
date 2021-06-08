const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const PortfolioAllocationReport = sequelize.define('portfolioAllocationReport', {
        seReturn : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        seRisk : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        seSharpeRatio : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        mrReturn : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        mrRisk : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        mrSharpeRatio : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return PortfolioAllocationReport
}