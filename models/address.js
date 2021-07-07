const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('address', {
        address : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        blockchain : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        balance: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    })
    return Address
}