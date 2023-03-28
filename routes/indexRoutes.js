const express = require('express')
const router = express.Router()
const models = require("../models")
const bcrypt = require('bcrypt')
const SALT_ROUND = 10

// router.get('/', (req, res) => {
//     res.render('index')
// })
//
// router.get('/register', (req,res) => {
//     res.render('register')
// })

router.post('/register', async (req,res) => {
    const {username, password} = req.body
    const persistedUser = await models.User.findOne({
        where: {
            username: username
        }
    })

    if (persistedUser != null) {
        res.json({message: 'Username is already exists'})
    } else {
        bcrypt.hash(password, SALT_ROUND, function (err, hash)  {
            if (err == null) {
                    const user = models.User.build({
                        username: username,
                        password: hash
                    })
                    // setting user into the session object
                    req.session.user = {
                        username: username,
                        password: hash
                    }
                    user.save().then(user => {
                        console.log('User registered')
                    })

                    res.redirect('/add-product')
            }
        })
    }




})

// router.get('/login', (req,res) => {
//     res.render('login')
// })

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const persistedUser = await models.User.findOne({
        where: {
            username: username,
            // password: password
        }
    }) //check if User exists in DB

    if (persistedUser != null) {
        bcrypt.compare(password, persistedUser.password, function (err, result) {
            if (result) {
                if (req.session) {
                    req.session.user = {
                        username: username,
                        password: persistedUser.password,
                        userId: persistedUser.id
                    }
                }

                res.redirect('/products')
            }
        })
    } else {
        console.log(persistedUser)
        // res.render('login',{message: "Invalid username or password!"})
    }

})

module.exports = router