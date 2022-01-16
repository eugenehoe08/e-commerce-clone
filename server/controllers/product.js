const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
    const newProduct = new Product(req.body);

    newProduct.save().then((result) =>
        res.status(200).json({
            message: 'Product created successfully',
            product: result,
        })
    );
};