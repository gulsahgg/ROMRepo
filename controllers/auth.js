const mysql = require("mysql");

const db= mysql.createConnection({
    host: process.env.DATABASE_HOST ,
    user: process.env.DATABASE_USER ,
    password: process.env.DATABASE_PASSWORD ,
    database: process.env.DATABASE
});
exports.login =  (req,res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result)=>{
            console.log(result);
            if(!result || !(password === result[0].password)){
                res.send({result_code: 'failed', message: 'passwords do not matched'});
            }else{
                res.send({
                    result_code: 'ok',
                    message: 'passwords matched'});
                
            }

        })
    }catch(error){
        console.log(error);
        res.send({result_code: 'failed', message: 'no mail'});
    }
}
exports.register = (req,res) => {
    console.log(req.body);

    const { email, password } = req.body;

    db.query('SELECT email FROM users WHERE email = ?' , [email],  (err, result) =>{
        if (err){
            console.log("error in getting user info from my sql")
            console.log(err);
            return res.send({
                result_code: "error",
                message: "error in getting user info from my sql"});
        }
        
        if(result.length > 0){ //if email registered before
            return res.send({result_code: "exist",
            message: 'that email is already in use'});
        
        }
        db.query('INSERT INTO users SET ?', {email: email, password: password}, (err, result) =>{
            if(err){
                console.log('error in inserting user to my sql')
                console.log(error);
                return res.send({
                    result_code: "error",
                    message: 'error in inserting user to my sql'});
            }
            else{                   //everything is ok and user registered successfully
                console.log(result);
                
                return res.send({result_code: "ok", message: 'user registered'});
            }
        });
    
    });

    
}