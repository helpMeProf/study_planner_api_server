const jwt = require('jsonwebtoken');
const secretKey = require("../config/jwtconfig").key;
const tokenCheck = (req,res,next)=>{
    const token = req.headers['x-access-token'];
    console.log(token);
    if(!token){
        return res.json({
            success : "FAIL"
        });
    }
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err) {
            return res.json({
                success : "FAIL"
            });
        }
        console.log("tokenCheck");
        console.log(decoded);
        next();
    });
    
    
}
module.exports = tokenCheck;