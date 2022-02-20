const express = require("express");
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/errorHandler');

app.use(cors());
app.options('*', cors());

require('dotenv/config');
const api = process.env.API_URL;
const connectionString = process.env.CONNECTION_STRING;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));


//Routes
const productsRoutes = require('./routes/products');
const categoriesRoutes = require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');


//Routers
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'eshop-db'
})
.then( ()=>{
    console.log("Database connection is ready...")
})
.catch((err)=>{
    console.log(err);
})

//Server
app.listen(3000, ()=> {
    console.log("server is running http://localhost:3000");
    console.log("crtl + c to terminate server");
})