const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Cryptocurrency = sequelize.define('cryptocurrency', {
        website : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        tehnicalDoc : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        explorer : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        source_code : {
            type: Sequelize.STRING(255),
            allowNull : true
        },
        logo : {
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
        description : {
            type: Sequelize.STRING(255),
            allowNull : true
        }
    })
    return Cryptocurrency
}