const Router = require("router")
const database = require("../db.js")
const router = Router()
const { sequelize } = require("../db.js");
const DataTypes = sequelize.DataTypes;
const tables = database.tables

const bcrypt = require('bcrypt');
const saltRounds = 10;

const api_key = '09ca05befe815e72a0bccba760f51092-dc5f81da-2fe1257f';
const DOMAIN = 'sandbox433482a392a049d290753ae57509a2e6.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey: api_key, domain: DOMAIN });

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


// add asset to followed list
router.post('/add-asset-followed-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let list = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
                if(req.query.asset == 'crypto'){
                    await tables['Cryptocurrency'].create({ 
                        website : req.body.website,
                        tehnicalDoc : req.body.tehnicalDoc,
                        explorer: req.body.explorer,
                        source_code: req.body.source_code,
                        logo: req.body.logo,
                        name: req.body.name,
                        symbol: req.body.symbol,
                        description: req.body.description,
                        numberOfAssetsOwned: req.body.numberOfAssetsOwned,
                        listFollowedAssetId: list.id
                     })
                     // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                     //.then(crypto => {
                    //     // await tables['DailyCryptoPrices'].create({
                            
                    //     // })
                    // })
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
                        listFollowedAssetId: list.id
                    })
                    // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                }
                
                res.status(201).json({
                    Message: "Resource created",
                    statusCode: 201
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




// add asset to owned list
router.post('/add-asset-owned-list', async(req, res, next) => {
    try {
        if (req.query.email && req.query.email !== null && 
            req.query.email !== '') {
            let user = await tables.User.findOne({ where: { email: req.query.email } })
            if (user != null) {
                let list = await tables['ListFollowedAssets'].findOne({where: {userId: user.id}})
                if(req.query.asset == 'crypto'){
                    await tables['Cryptocurrency'].create({ 
                        website : req.body.website,
                        tehnicalDoc : req.body.tehnicalDoc,
                        explorer: req.body.explorer,
                        source_code: req.body.source_code,
                        logo: req.body.logo,
                        name: req.body.name,
                        symbol: req.body.symbol,
                        description: req.body.description,
                        numberOfAssetsOwned: req.body.numberOfAssetsOwned,
                        listOwnedAssetId: list.id
                     })
                     // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                     //.then(crypto => {
                    //     // await tables['DailyCryptoPrices'].create({
                            
                    //     // })
                    // })
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
                        listOwnedAssetId: list.id
                    })
                    // POATE FAC CALL DE FIECARE DATA PENTRU PRETURI CA SA NU LE MAI SALVEZ
                }
                
                res.status(201).json({
                    Message: "Resource created",
                    statusCode: 201
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


module.exports = router