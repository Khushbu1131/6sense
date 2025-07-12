const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // in percentage
    image: String,
    status: { type: String, enum: ['In Stock', 'Stock Out'], default: 'In Stock' },
    productCode: { type: String, unique: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);