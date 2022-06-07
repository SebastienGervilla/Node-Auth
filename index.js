const mongoose = require('mongoose');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

// Database connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected");
}).catch((error) => {
    console.log("Database connection Error : " + error);
});

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoute');

app.use('/api', userRoutes);

// Starting the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`App running at port ${port}`)
});