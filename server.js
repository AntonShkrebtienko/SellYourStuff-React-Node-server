const express = require('express')
const formidable = require("formidable") // formidable - package for uploading files into your server
const app = express()
const models = require('./models')


app.get('/api', async (req, res) => {
    const products = await models.Product.findAll()

    console.log(products)
})

app.listen(5000, () => {
    console.log('Server started on port 5000')
})
