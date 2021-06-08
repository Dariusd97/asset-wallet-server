const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const ListOwnedAssets = sequelize.define('listOwnedAssets', {
        name : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return ListOwnedAssets
}