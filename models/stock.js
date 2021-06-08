const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Stock = sequelize.define('stock', {
        assetType : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        description : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        logo : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        ceo : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        employees : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        headquarter : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        sector : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        industry : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        marketCap : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        peRatio : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        dividentYield : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        beta : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        name : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        symbol : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        revenue : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        eps : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        country : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        numberOfAssetsOwned : {
            type: Sequelize.INTEGER,
            allowNull : true
        }
    })
    return Stock
}