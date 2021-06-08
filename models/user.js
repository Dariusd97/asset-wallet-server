const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('users', {
        email : {
            type: Sequelize.STRING(255),
            allowNull : false,
            validate : {
                isEmail : true
            }
        },
        password : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        username : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return User
}