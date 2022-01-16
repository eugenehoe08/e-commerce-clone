const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cors = require('cors');
const { addSchema } = require('./scripts/addSchema');

dotenv.config();

app.use(express.json());
app.use(cors());

app.use('/user', userRoute);
app.use('/auth', authRoute);
app.use('/product', productRoute);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log('Server started on port ' + 5000);
        });
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err.message);
    });