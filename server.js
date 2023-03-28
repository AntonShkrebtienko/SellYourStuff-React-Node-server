const express = require('express')
const app = express()
const bodyParser = require('body-parser') //read body with this package
const usersRoutes = require('./routes/usersRoutes')
const indexRoutes = require('./routes/indexRoutes')
const session = require('express-session')

const PORT = 5000

// setting listener

app.listen(PORT, () => {
    console.log(`Server has started on PORT: ${PORT}`)
})



// const checkAuthorisation = require('./services/auth-check') //custom middleware // TODO

global.__basedir = __dirname;

app.use(bodyParser.urlencoded({extended: false}))

// static folders
app.use('/uploads', express.static('uploads'))
app.use('/css', express.static('css'))

// set up session usage
app.use(session({
    secret: "adwadsawdasdawd",
    resave: false,
    saveUninitialized: false
}))

//check if user is authenticated // TODO
// app.use((req, res, next) => {
//     res.locals.authenticated = !!req.session.user
//     next()
// })


// setting routes
app.use('/users', usersRoutes)
app.use('/', indexRoutes)


