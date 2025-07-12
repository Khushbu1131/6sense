const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Import routes
const productRoutes = require('./routes/productRoutes');
app.use('/api', productRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Product API is running...');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api', categoryRoutes);