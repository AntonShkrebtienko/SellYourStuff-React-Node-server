const express = require('express')
const formidable = require("formidable") // formidable - package for uploading files into your server
const router = express.Router()
const models = require('../models')

let uniqFileName = ''

function uploadFile(req, callback) {
   const form = new formidable.IncomingForm({keepExtensions: true})
    form.uploadDir = __basedir + '/uploads/'
    form.parse(req)
        .on('fileBegin', ( name, file ) => {
            uniqFileName = file.newFilename
        })
        .on('file', ( name, file ) => {
            callback(file.newFilename)
        })
        console.log(uniqFileName)
}

router.post('/add-product', async (req, res) => {
    const {title, description} = req.body
    const price = parseFloat(req.body.price)
    // const userId = req.session.user.userId
    const userId = 10 // temporarily
    console.log(`Price: ${price}, type: ${typeof(price)}`)
    const product = models.Product.build({
        title: title,
        description: description,
        price: price,
        userId: userId,
        imageUrl:uniqFileName
    })

    const persistedProduct = await product.save()
    if (persistedProduct != null) {
        res.redirect('products')
    } else {
        res.render('/add-product')
    }
})

router.post('/upload', (req, res) => {

    uploadFile(req, (photoUrl) => {
        photoUrl = `/uploads/${photoUrl}`
        // res.render('users/add-product', {imageUrl: photoUrl, isImage: true})
    })

})

router.get('/products', async (req, res) => {
    const products = await models.Product.findAll({
        where: {
            userId: 10 // TODO change to real userId
        }
    })
    const user = req.session.user
    // console.log(req.session.user)
    res.json({products, user})
})

router.post('/delete-product', async (req, res) => {
     await models.Product.destroy({
        where: {
            id: req.body.productId
        }
    })

    res.redirect('products')
})

router.get('/edit-product/:productId', async (req, res) => {
    const productId = req.params.productId
    const product = await models.Product.findByPk(productId)

    res.render('users/edit-product', product.dataValues)
})

router.post('/edit-product/:productId', async (req, res) => {
    const productId = parseInt(req.params.productId)
    const {title, description} = req.body
    const price = parseFloat(req.body.price)

    await models.Product.update({
        title,
        description,
        price,
        imageUrl: uniqFileName
    }, {
        where: {
            id: productId
        }
    })
    res.redirect('/users/products')
})

router.post('/upload/edit/:productId', async (req, res) => {
    uploadFile(req, async (photoUrl) => {
        const productId = parseInt(req.params.productId)
        const product = await models.Product.findByPk(productId)

        const response =  product.dataValues
        response.imageUrl = photoUrl

        res.render('users/edit-product', response)
    })

})
module.exports = router
