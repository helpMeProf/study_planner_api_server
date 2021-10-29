const mysql = require('mysql');
const config = require('../config/dbconfig.js');
let pool = mysql.createPool(config);

function getConnection(callback){
    pool.getConnection((err,conn)=>{
        if(!err){
            callback(conn);
        }
    });
}

module.exports = getConnection;
