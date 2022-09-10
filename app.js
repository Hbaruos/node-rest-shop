const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// logger middleware
const morgan = require('morgan')
const mongoose = require('mongoose')

app.use(morgan('dev'))
app.use(express.urlencoded({extended: false}));
app.use(express.json())
app.use('/uploads', express.static('uploads'))

mongoose.connect(
    'mongodb+srv://sourabh:' + process.env.MONGO_ATLAS_PW + '@cluster0.k8ommm7.mongodb.net/node-rest-shop?retryWrites=true&w=majority')
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. ${err}`);
    })

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user')

// For routing anything that starts with /products will be routed to ./api/routes/products.js
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(port, () => console.log(`server running on http://localhost:3000`))