const { DataTypes } = require('sequelize');

const { sequelize } = require("../db.js");
const Sequelize = require("sequelize")

module.exports = (sequelize, DataTypes) => {
    const MonteCarloSimulationReport = sequelize.define('monteCarloSimulationReport', {
        daysToForecast : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        nrOfSimulation : {
            type: Sequelize.STRING(255),
            allowNull : false
        },
        startDate : {
            type: Sequelize.STRING(255),
            allowNull : false
        }
    })
    return MonteCarloSimulationReport
}