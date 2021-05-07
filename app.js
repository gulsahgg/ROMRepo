const express = require('express');
//const fs = require('fs');
const path= require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const bodyParser = require('body-parser');

const app = express();

dotenv.config({ path: "./.env"});

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST ,
    user: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD ,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, "./uploads");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))

db.connect((err) => {
    if(err) {
        console.log(err);
        connection = reconnect(connection);
    }else{
        console.log("mysql connected...")
    }
} )
//Routes you should check
app.use('/video',  require('./routes/video'));
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(3000, () => console.log("listening 3000"));