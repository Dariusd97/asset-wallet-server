const Router = require("router")
const database = require("../db.js")
const router = Router()
const { sequelize } = require("../db.js");
const DataTypes = sequelize.DataTypes;
const tables = database.tables

const bcrypt = require('bcrypt');
const { query } = require("express");
const saltRounds = 10;

const api_key = '09ca05befe815e72a0bccba760f51092-dc5f81da-2fe1257f';
const DOMAIN = 'sandbox433482a392a049d290753ae57509a2e6.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

/// CAND ADAUGA UN ASSET NOU trebuie verificat daca exista deja -> atunci ii fac upadte la fk, daca nu ii fac create


// create one user
router.post('/create', async(req, res, next) => {
    try {
        if (req.body.email && req.body.email !== null && 
            req.body.email !== '' && 
            req.body.password && 
            req.body.password !== null && 
            req.body.password !== '') {

            let response = await tables.User.findOne({ where: { email: req.body.email } })
            if (response == null) {
                const passwordHash = bcrypt.hashSync(req.body.password, saltRounds);
                createdUser = await tables['User'].create({ 
                    email: req.body.email, 
                    password: passwordHash , 
                    username: req.body.username
                })
                
                await tables['ListFollowedAssets'].create({
                    name: "Followed List",
                    userId: createdUser.id
                })

                await tables['ListOwnedAssets'].create({
                    name: "Owned List",
                    userId: createdUser.id
                })
                
                res.status(201).json({
                    Message: "Resource created",
                    statusCode: 201
                })
            }
            else {
                res.status(409).json({
                    Message: "User already exists",
                    statusCode: 409
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// check is user exists
router.get("/login", async(req, res, next) => {
    try {
        if (Object.entries(req.query).length != 0 && req.query.email !== undefined && req.query.email !== '' && req.query.password !== undefined && req.query.password !== '') {
            await tables['User'].findOne({
                where: { email: req.query.email }
            }).then(user => {
                if (user) {
                    const existsPasswordMatch = bcrypt.compareSync(req.query.password, user['dataValues']['password'])
                    if (existsPasswordMatch) {
                        res.status(200).json(user)
                    }
                    else {
                        res.status(404).json({
                            Message: "Incorrect username or password",
                            statusCode: 404
                        })
                    }
                }
                else {
                    res.status(404).json({
                        Message: "Incorrect username or password",
                        statusCode: 404
                    })
                }
            })
        }
        else {
            res.status(400).json({ Message: "Bad request" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// update user password
router.put('/recoverPassword', async(req, res, next) => {
    try {
        if (req.query && req.query.email !== null && req.query.email !== '' && req.query.password && req.query.password !== null && req.query.password !== '') {
            await tables['User'].findOne({
                where: {
                    email: req.query.email
                }
            }).then(user => {
                if (user) {
                    const passwordHash = bcrypt.hashSync(req.query.password, saltRounds);
                    user.update({ password: passwordHash }).then(() => {
                        sendMail(req.query.email)
                        res.status(200).json({
                            Message: "Password updated",
                            statusCode : 200
                            })
                    })
                }
                else {
                    res.status(404).json({ 
                        Message: "Username doesn't exists",
                        statusCode: 404
                    })
                }
            })
        }
        else {
            res.status(400).json({ Message: "Bad request" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

async function sendMail(toEmail) {
    var data = {
        from: "My Nodejs Application <postmaster@sandbox433482a392a049d290753ae57509a2e6.mailgun.org>",
        to: `<${toEmail}>`,
        subject: 'Test Mail',
        text: 'You are truly awesome!'
    };

    mailgun.messages().send(data, function(error, body) {
        console.log(body);
    });
}


// add stock to followed-owned list
router.post('/add-stock-to-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                if(req.query.type == "owned"){
                    let list = await tables['ListOwnedAssets'].findOne({where: {userId: user.id}})
                    let stock = await tables['Stock'].findOne({where: {symbol: req.query.symbol}})
                    if(stock != null) {
                        stock.update({
                            listOwnedAssetId: list.id
                        })
                    } else {
                        await tables['Stock'].create({ 
                            logo: req.body.logo,
                            assetType: req.body.assetType,
                            description: req.body.description,
                            ceo: req.body.ceo,
                            employees: req.body.employees,
                            headquarter: req.body.headquarter,
                            sector: req.body.sector,
                            industry: req.body.industry,
                            market_cap: req.body.market_cap,
                            peRatio: req.body.peRatio,
                            dividentYield: req.body.dividentYield,
                            beta: req.body.beta,
                            name: req.body.name,
                            symbol: req.body.symbol,
                            revenue: req.body.revenue,
                            eps: req.body.eps,
                            country: req.body.country,
                            numberOfAssetsOwned: req.body.numberOfAssetsOwned,
                            price: req.body.price,
                            listOwnedAssetId: list.id
                        })
                        // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                    }
                } else if(req.query.type == "followed") {
                    let list = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
                    let stock = await tables['Stock'].findOne({where: {symbol: req.query.symbol}})
                if(stock != null) {
                    stock.update({
                        listFollowedAssetId: list.id
                    })
                } else {
                    await tables['Stock'].create({ 
                        logo: req.body.logo,
                        assetType: req.body.assetType,
                        description: req.body.description,
                        ceo: req.body.ceo,
                        employees: req.body.employees,
                        headquarter: req.body.headquarter,
                        sector: req.body.sector,
                        industry: req.body.industry,
                        market_cap: req.body.market_cap,
                        peRatio: req.body.peRatio,
                        dividentYield: req.body.dividentYield,
                        beta: req.body.beta,
                        name: req.body.name,
                        symbol: req.body.symbol,
                        revenue: req.body.revenue,
                        eps: req.body.eps,
                        country: req.body.country,
                        numberOfAssetsOwned: 0,
                        price: req.body.price,
                        listFollowedAssetId: list.id
                    })
                    // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                }
                }
                res.status(201).json({
                    Message: "Resource created"
                })
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})




// add stock to followed-owned list
router.post('/add-crypto-to-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                if(req.query.type == "owned"){
                    let list = await tables['ListOwnedAssets'].findOne({where: {userId: user.id}})
                    let crypto = await tables['Cryptocurrency'].findOne({where: {symbol: req.query.symbol}})
                    if(crypto != null) {
                        crypto.update({
                            listOwnedAssetId: list.id
                        })
                    } else {
                        await tables['Cryptocurrency'].create({ 
                            website: req.body.urls.website[0],
                            tehnicalDoc: req.body.urls.technical_doc[0],
                            explorer: req.body.urls.explorer[0],
                            source_code: req.body.urls.source_code[0],
                            logo: req.body.logo,
                            name: req.body.name,
                            symbol: req.body.symbol,
                            description: req.body.description,
                            numberOfAssetsOwned : req.body.numberOfAssetsOwned,
                            price : req.body.price,
                            listOwnedAssetId: list.id
                        })
                    }
                } 
                res.status(201).json({
                    Message: "Resource created"
                })
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// get all followed assets
router.get('/get-asset-followed-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let folowedList = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
                let stocks = await tables['Stock'].findAll({where: {listFollowedAssetId: folowedList.id}})
                let cryptocurrencies = await tables['Cryptocurrency'].findAll({where: {listFollowedAssetId: folowedList.id}})
                res.status(200).json({
                    stock: stocks,
                    crypto: cryptocurrencies
                })
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// get all followed assets
router.get('/get-asset-followed-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let folowedList = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
                let stocks = await tables['Stock'].findAll({where: {listFollowedAssetId: folowedList.id}})
                let cryptocurrencies = await tables['Cryptocurrency'].findAll({where: {listFollowedAssetId: folowedList.id}})
                res.status(200).json({
                    stock: stocks,
                    crypto: cryptocurrencies
                })
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})
// remove one asset from followed assets
router.delete('/remove-asset-followed-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.name) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            let folowedList = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
            if (user != null) {
                let foundStock = await tables['Stock'].findOne({where: {listFollowedAssetId: folowedList.id,name: req.query.name }})
                await tables['Stock']
                    .update({
                        listFollowedAssetId: null
                    })
                    .then(() => {
                        res.status(200).json("Resource deleted!")
                    })
            } else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// remove one asset from OWNED assets
router.delete('/remove-asset-ownd-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.name) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            let ownedList = await tables['ListOwnedAssets'].findOne({where: {userId: user.id}})
            if (user != null) {
                let foundStock = await tables['Stock'].findOne({where: {listOwnedAssetId: ownedList.id,name: req.query.name }})
                foundStock.update({
                    listOwnedAssetId: null
                }).then(() => {
                    res.status(200).json("Resource deleted!")
                })
            } else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// remove one crypto from OWNED assets
router.delete('/remove-crypto-owned-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            let ownedList = await tables['ListOwnedAssets'].findOne({where: {userId: user.id}})
            if (user != null) {
                let foundCrypto = await tables['Cryptocurrency'].findOne({where: {listOwnedAssetId: ownedList.id,symbol: req.query.symbol }})
                foundCrypto.update({
                    listOwnedAssetId: null
                }).then(() => {
                    res.status(200).json("Resource deleted!")
                })
            } else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// get all owned assets
router.get('/get-asset-owned-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let ownedList = await tables['ListOwnedAssets'].findOne({where: {userId: user.id}})
                let stocks = await tables['Stock'].findAll({where: {listOwnedAssetId: ownedList.id}})
                let cryptocurrencies = await tables['Cryptocurrency'].findAll({where: {listOwnedAssetId: ownedList.id}})
                
                let formattedCrypto = []
                for(let i = 0; i < cryptocurrencies.length; i++) {
                    let jsonCrypto = {}
                    jsonCrypto['logo'] = cryptocurrencies[i].logo
                    jsonCrypto['name'] = cryptocurrencies[i].name
                    jsonCrypto['symbol'] = cryptocurrencies[i].symbol
                    jsonCrypto['description'] = cryptocurrencies[i].description
                    jsonCrypto['numberOfAssetsOwned'] = cryptocurrencies[i].numberOfAssetsOwned
                    jsonCrypto['price'] = cryptocurrencies[i].price
                
                    let jsonCryptoURL = {}

                    let wb = []
                    wb.push(cryptocurrencies[i].website)
                    jsonCryptoURL['website'] = wb

                    let td = []
                    td.push(cryptocurrencies[i].tehnicalDoc)
                    jsonCryptoURL['technical_doc'] = td

                    let e = []
                    e.push(cryptocurrencies[i].explorer)
                    jsonCryptoURL['explorer'] = e

                    let sc = []
                    sc.push(cryptocurrencies[i].source_code)
                    jsonCryptoURL['source_code'] = sc

                    jsonCrypto['urls'] = jsonCryptoURL

                    formattedCrypto.push(jsonCrypto)
                }
                
                res.status(200).json({
                    stock: stocks,
                    crypto: formattedCrypto
                })
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// create objectives for a user
router.post('/create-objectives', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.goal) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['FinancialGoal']
                    .create({
                        goal: req.query.goal,
                        userId: user.id
                    })
                    .then(createdObjective => {
                        let goal = {}
                        goal['goal'] = createdObjective.goal
                        goal['id'] = createdObjective.id
                        res.status(201).json(goal)
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// get all objectives for a user
router.get('/get-all-objectives', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let objectives = await tables['FinancialGoal'].findAll({where: {userId: user.id}})
                let foo = []
                for(let i = 0; i < objectives.length; i++) {
                    let goal = {}
                    goal['id'] = objectives[i].id;
                    goal['goal'] = objectives[i].goal;
                    foo.push(goal)
                }
                res.status(200).json(foo)         
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// remove objective for a user
router.delete('/remove-objective', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.id) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['FinancialGoal']
                    .destroy({where: {userId: user.id, id: req.query.id}})
                    .then(() => [
                        res.status(200).json("Resource deleted!")         
                    ])
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// create address for a user
router.post('/create-address', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['Address']
                    .create({
                        address: req.body.address,
                        blockchain: req.body.blockchain,
                        balance: req.body.balance,
                        userId: user.id
                    })
                    .then(createdObjective => {
                        res.status(201).json(createdObjective)
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// get all addresses for a user
router.get('/get-all-addresses', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['Address']
                    .findAll({ 
                        where:{
                            userId: user.id
                        }
                    })
                    .then(allAddresses => {
                        res.status(200).json(allAddresses)
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// remove address for a user
router.delete('/remove-address', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.address) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['Address']
                    .destroy({ 
                        where:{
                            userId: user.id,
                            address: req.query.address
                        }
                    })
                    .then(() => {
                        res.status(200).json("Resource deleted!")
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// get all monte carlo reports for a user
router.get('/get-all-mc-reports', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['MonteCarloSimulation']
                    .findAll({ 
                        where:{
                            userId: user.id
                        }
                    })
                    .then(async(mcReports) => {
                        let jsonList = []
                        for(let i = 0; i < mcReports.length; i++) {
                            let jsonObject = {}
                            jsonObject['id'] = mcReports[i].id
                            jsonObject['daysToForecast'] = mcReports[i].daysToForecast
                            jsonObject['nrOfSimulation'] = mcReports[i].nrOfSimulation
                            jsonObject['userId'] = mcReports[i].userId
                            let report_entry = await tables['ReportEntity'].findAll({where: {monteCarloSimulationReportId: mcReports[i].id}})
                            let restultsJson = []
                            for(let j = 0; j < report_entry.length; j++) {
                                let dataJson = {}
                                dataJson['symbol'] = report_entry[j].stockName
                                dataJson['expected_value'] = report_entry[j].expectedValue
                                dataJson['returns'] = report_entry[j].return
                                dataJson['_prob_breakeven'] = report_entry[j].probBreakeven
                                dataJson['beta'] = report_entry[j].beta
                                dataJson['sharpe'] = report_entry[j].sharpe
                                dataJson['capm_return'] = report_entry[j].campReturn
                                restultsJson.push(dataJson)
                            }
                            jsonObject['results'] = restultsJson
                            jsonList.push(jsonObject)
                        }
                        res.status(200).json(jsonList)
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})

// save mc for a user
router.post('/save-mc-sim', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['MonteCarloSimulation']
                    .create({
                        daysToForecast: req.body.daysToForecast,
                        nrOfSimulation: req.body.nrOfSimulation,
                        startDate: "2000-02-02",
                        userId: user.id
                    })
                    .then(savedMC => {
                        for(let i = 0; i < req.body.results.length; i++) {
                            tables['ReportEntity'].create({
                                expectedValue: req.body.results[i].expected_value,
                                return: req.body.results[i].returns,
                                probBreakeven: req.body.results[i]._prob_breakeven,
                                beta: req.body.results[i].beta,
                                sharpe: req.body.results[i].sharpe,
                                campReturn: req.body.results[i].capm_return,
                                stockName: req.body.results[i].symbol,
                                monteCarloSimulationReportId: savedMC.id
                            })
                        }
                        res.status(201).json("Resource saved!")
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// remove monte carlo report for a user
router.delete('/remove-mc-report', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.id) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['ReportEntity'].destroy({where: {monteCarloSimulationReportId: req.query.id}})
                await tables['MonteCarloSimulation']
                    .destroy({ 
                        where:{
                            userId: user.id,
                            id: req.query.id
                        }
                    })
                res.status(200).json("Resource deleted!")
                    
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// save portfolio for a user
router.post('/save-portfolio-sim', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['PortfolioAllocationReport']
                    .create({
                        seReturn: req.body.method_1._returns,
                        seRisk: req.body.method_1._risk,
                        seSharpeRatio: req.body.method_1._sharpe_ratio,
                        mrReturn: req.body.method_2._returns,
                        mrRisk: req.body.method_2._risk,
                        mrSharpeRatio: req.body.method_2._sharpe_ratio,
                        userId: user.id
                    })
                    .then(savedPortfolio => {
                        let weights_1 = req.body.method_1._weights.split(",")
                        let weights_2 = req.body.method_2._weights.split(",")
                        if(weights_1.length == 1) {
                            tables['Returns'].create({
                                seValue: weights_1[0],
                                mrValue: weights_2[0],
                                stockName: req.body.assets[0],
                                portfolioAllocationReportId: savedPortfolio.id
                            })

                        } else if (weights_1.length == 2){
                            for(let i = 0 ; i < req.body.assets.length; i++) {
                                tables['Returns'].create({
                                    seValue: weights_1[i],
                                    mrValue: weights_2[i],
                                    stockName: req.body.assets[i],
                                    portfolioAllocationReportId: savedPortfolio.id
                                })
                            }
                        } else if (weights_1.length == 3) {
                            for(let i = 0 ; i < req.body.assets.length; i++) {
                                tables['Returns'].create({
                                    seValue: weights_1[i],
                                    mrValue: weights_2[i],
                                    stockName: req.body.assets[i],
                                    portfolioAllocationReportId: savedPortfolio.id
                                })
                            }
                        } else if (weights_1.length == 4) {
                            for(let i = 0; i < weights.length; i++) {
                                tables['Returns'].create({
                                    seValue: req.body.returns[i].seValue,
                                    mrValue: req.body.returns[i].mrValue,
                                    stockName: req.body.returns[i].stockName,
                                    portfolioAllocationReportId: savedPortfolio.id
                                })
                            }
                        }
                        res.status(201).json("Resource saved!")
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



// get all portfolio allocations reports for a user
router.get('/get-all-portoflio-allocation-reports', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['PortfolioAllocationReport']
                    .findAll({ 
                        where:{
                            userId: user.id
                        }
                    })
                    .then(async(paReports) => {
                        let jsonList = []
                        for(let i = 0; i < paReports.length; i++) {
                            let jsonObject = {}
                            jsonObject['id'] = paReports[i].id
                            jsonMethod1 = {}
                            jsonMethod1['_returns'] = paReports[i].seReturn
                            jsonMethod1['_risk'] = paReports[i].seRisk
                            jsonMethod1['_sharpe_ratio'] = paReports[i].seSharpeRatio                          

                            jsonMethod2 = {}
                            jsonMethod2['_returns'] = paReports[i].mrReturn
                            jsonMethod2['_risk'] = paReports[i].mrRisk
                            jsonMethod2['_sharpe_ratio'] = paReports[i].mrSharpeRatio
                           
                            let returns = await tables['Returns'].findAll({where: {portfolioAllocationReportId: paReports[i].id}})
                            let assets = []
                            for(let i = 0; i < returns.length; i++) {
                                assets.push(returns[i].stockName)
                            }
                            jsonObject['assets'] = assets

                            if (assets.length == 1) {
                                jsonMethod1['_weights'] = returns[0].seValue
                                jsonMethod2['_weights'] = returns[0].mrValue
                            }
                            if (assets.length == 2) {
                                jsonMethod1['_weights'] = returns[0].seValue + "," + returns[1].seValue
                                jsonMethod2['_weights'] = returns[0].mrValue + "," + returns[1].mrValue
                            }
                            if (assets.length == 3) {
                                jsonMethod1['_weights'] = returns[0].seValue + "," + returns[1].seValue + "," + returns[2].seValue
                                jsonMethod2['_weights'] = returns[0].mrValue + "," + returns[1].mrValue + "," + returns[2].mrValue
                            }
                            if (assets.length == 4) {
                                jsonMethod1['_weights'] = returns[0].seValue + "," + returns[1].seValue + "," + returns[2].seValue + "," + returns[3].seValue
                                jsonMethod2['_weights'] = returns[0].mrValue + "," + returns[1].mrValue + "," + returns[2].mrValue + "," + returns[3].mrValue
                            }
                            jsonObject['method_1'] = jsonMethod1
                            jsonObject["method_2"] = jsonMethod2
                            
                            jsonList.push(jsonObject)
                        }
                        res.status(200).json(jsonList)
                    }) 
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})


// remove portfolio allocation report for a user
router.delete('/remove-portfolio-allocation-report', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && req.query.email !== '' && req.query.id) {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                await tables['Returns'].destroy({where: {portfolioAllocationReportId: req.query.id}})
                await tables['PortfolioAllocationReport']
                    .destroy({ 
                        where:{
                            userId: user.id,
                            id: req.query.id
                        }
                    })
                res.status(200).json("Resource deleted!")
                    
            }
            else {
                res.status(409).json({
                    Message: "User doesn't exists",
                    statusCode: 404
                })
            }
        }
        else {
            res.status(400).json({
                Message: "Bad request",
                statusCode: 400
            })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ Message: "Server error" })
    }
})



module.exports = router