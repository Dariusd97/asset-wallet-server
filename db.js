const Sequelize = require("sequelize")

const database = 'assetWalletDB'
const username = 'root'
const password = '12345678'
const hostname = 'localhost'

const sequelize = new Sequelize(database, username, password, {
    host : hostname,
    dialect : 'mysql',
    pool: {
        max: 5,
        min: 0,
  }
})

const tables = {
    User : require('./models/user')(sequelize),
    Stock: require('./models/stock')(sequelize),
    Returns: require('./models/returns')(sequelize),
    ReportEntity: require('./models/report_entry')(sequelize),
    PortfolioAllocationReport: require('./models/portfolio_allocation_report')(sequelize),
    MonteCarloSimulation: require('./models/monte_carlo_simulation_report')(sequelize),
    ListOwnedAssets: require('./models/list_owned_assets')(sequelize),
    ListFollowedAssets: require('./models/list_followed_assets')(sequelize),
    DailyStockPrices: require('./models/daily_stock_prices')(sequelize),
    DailyCryptoPrices: require('./models/daily_crypto_prices')(sequelize),
    Cryptocurrency: require('./models/cryptocurrency')(sequelize),
    FinancialGoal: require('./models/financial_goal')(sequelize)
}

tables.User.hasMany(tables.FinancialGoal)
tables.User.hasMany(tables.MonteCarloSimulation)
tables.User.hasMany(tables.PortfolioAllocationReport)
tables.User.hasOne(tables.ListFollowedAssets)
tables.User.hasOne(tables.ListOwnedAssets)
tables.MonteCarloSimulation.hasMany(tables.ReportEntity)
tables.PortfolioAllocationReport.hasMany(tables.Returns)
tables.ListFollowedAssets.hasMany(tables.Cryptocurrency)
tables.ListFollowedAssets.hasMany(tables.Stock)
tables.ListOwnedAssets.hasMany(tables.Cryptocurrency)
tables.ListOwnedAssets.hasMany(tables.Stock)
tables.Cryptocurrency.hasMany(tables.DailyCryptoPrices)
tables.Stock.hasMany(tables.DailyStockPrices)

// mysql -u root -p
// 12345678
// use fastShoppingDB;
// show tables;

sequelize.sync()
    .then()
    .catch((error) => console.warn(error))
    
sequelize
    .authenticate()
    .then(() => {
        console.warn('Connection has been established successfully.')
    })
    .catch(error => {
        console.warn('Unable to connect to the database.',error)
    })
    
module.exports = {
    tables :tables,
    sequelize : sequelize
}