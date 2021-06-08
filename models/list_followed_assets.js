const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const ListFollowedAssets = sequelize.define('listFollowedAssets', {
        name : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return ListFollowedAssets
}