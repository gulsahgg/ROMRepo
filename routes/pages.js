const express = require("express");
const router = express.Router();
const mysql = require("mysql");
//const fs = require("fs");

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST ,
    user: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD ,
    database: process.env.DATABASE
});
router.get('/', (req,res) => {
    res.send({result_code: 'ok', message: "for auth operations connect to auth"});
});

router.get('/user/:idi', (req,res) => {
        try {
            
            //const {id, email, password} =res.body;

            db.query('SELECT * FROM users WHERE id = ?', [req.params.idi], (err, result)=>{

                if (err){
                    res.send({result_code: 'no', message: 'query error'})
                }
                console.log(result);
                var json = JSON.parse(JSON.stringify(result[0]),'utf8');
                res.send({result_code: 'ok', message: json.email});
                })
    
        }catch(error){
            console.log(error);
        }
    
});

module.exports = router;