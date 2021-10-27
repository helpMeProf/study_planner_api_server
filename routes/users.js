const express = require('express');
const getConnection = require('../db/dbUtils.js');
const router = express.Router();

/* GET home page. */

router.get('/', (req, res, next) =>{
  getConnection((conn)=>{
    conn.query('SELECT * FROM member',(err, rows, fields)=>{
      if(err) throw err;
      res.json({
        uid: rows[0],
        id: rows[1],
        password: rows[2],
        name : rows[3]
      });
    });
    conn.release();
  });
});

module.exports = router;
