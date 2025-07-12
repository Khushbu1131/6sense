const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/products', productController.createProduct);
router.patch('/products/:id', productController.updateProduct);
router.get('/products/:id', productController.getProductById);
router.get('/products', productController.getProducts);
module.exports = router;