const Product = require('../models/Product');
const Category = require('../models/Category');
const generateProductCode = require('../utils/productCodeGenerator');
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, discount, image, status, categoryId } = req.body;

        // Check if category exists
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Generate unique product code
        let productCode = generateProductCode(name);
        while (await Product.findOne({ productCode })) {
            productCode += Math.floor(Math.random() * 100); // ensure uniqueness
        }

        const product = new Product({
            name, description, price, discount, image, status,
            productCode,
            category: categoryId
        });

        await product.save();
        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, description, discount } = req.body;

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields if provided
        if (status) {
            if (!['In Stock', 'Stock Out'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status. Must be "In Stock" or "Stock Out"' });
            }
            product.status = status;
        }

        if (description) product.description = description;

        if (discount !== undefined) {
            if (discount < 0 || discount > 100) {
                return res.status(400).json({ message: 'Discount must be between 0 and 100' });
            }
            product.discount = discount;
        }

        // Save updated product
        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product by ID and populate category info
        const product = await Product.findById(id).populate('category', 'name');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate final price after discount
        const finalPrice = product.price - (product.price * (product.discount / 100));

        res.status(200).json({
            message: 'Product fetched successfully',
            product: {
                ...product._doc,
                finalPrice: finalPrice.toFixed(2) // Add final price with discount
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getProducts = async (req, res) => {
    try {
        const { category, name } = req.query;

        let filter = {};

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Search by name (case-insensitive)
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        // Fetch products with filter
        const products = await Product.find(filter).populate('category', 'name');

        // Add finalPrice to each product
        const result = products.map(p => ({
            ...p._doc,
            finalPrice: (p.price - (p.price * (p.discount / 100))).toFixed(2)
        }));

        res.status(200).json({
            message: 'Products fetched successfully',
            count: result.length,
            products: result
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};