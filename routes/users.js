const express = require('express');
const getConnection = require('../db/dbUtils.js');
const router = express.Router();
const secretKey = require("../config/jwtconfig").key;
const jwt = require('jsonwebtoken');
const tokenCheck = require('../middleware/tokenCheck');

router.post('/users/signup',(req,res)=>{
  const id = req.body.id;
  const password = req.body.password;
  const name = req.body.name;
  const query1 = "SELECT * FROM member WHERE user_id = ?";
  const query2 = "INSERT INTO member(user_id,user_password,user_name) VALUES(?,?,?)"
  getConnection((conn)=>{
    conn.query(query1,[id],(err,rows)=>{
      if(err){
        res.json({
          success: "error"
        });
        return;
      }
      if(rows.length == 1 ){
        res.json({
          success : "FAIL"
        });
        return;
      }
      getConnection((conn)=>{
        conn.query(query2,[id,password,name],(err,rows)=>{
          if(err){
            res.json({
              success : "FAIL"
            });
            return;
          }
          res.json({
            success : "OK"
          });
        })
      })
    });
  });
});
router.post('/users/login',(req,res)=>{
  const id = req.body.id;
  const password = req.body.password;
  const query = "SELECT * FROM member WHERE user_id = ? AND user_password = ?";
  getConnection((conn)=>{
    conn.query(query,[id,password],(err,rows)=>{
      if(err){
        res.json({
          success : "FAIL"
        });
        return;
      }
      const token = jwt.sign({
        id : id,
      },secretKey,{
        expiresIn : '1d',
        issuer : 'study_planner_server',
        subject : 'user_info'
      });
      res.json({
        token : token,
        success : "OK"
      });
    });
  });
});
//알맞은 user의 데이터만 가져오기 
router.get('/users/:user_uid/records/:date',tokenCheck,(req,res)=>{
  const uid = req.params.user_uid;
  const date = req.params.date;
  const query = "SELECT * FROM study_record WHERE user_uid = ? AND DATE(reg_date) = ?";
  getConnection((conn)=>{
    conn.query(query,[uid,date],(err, rows)=>{
      if(err) {
        res.json({
          success : "FAIL"
        });  
        return;
      }
      let success = 'NODATA';
      if(rows.length !==0) success = 'OK';
      res.json({
        user_data : rows,
        success : success
      });  
    });
    conn.release();
  });  
  }
);
//study record 갱신
router.put('/users/:user_uid/records/:date',tokenCheck,(req,res)=>{
    const subject_name = req.body.subject_name;
    const study_time = req.body.study_time;
    const uid = req.params.user_uid;
    const date = req.params.date;
    const query = "UPDATE study_record SET study_time = study_time + ? WHERE user_uid = ? AND DATE(reg_date) = ? AND subject_name = ?";
    getConnection((conn)=>{
        conn.query(query,[study_time,uid,date,subject_name],(err,rows)=>{
          if(err) {
            res.json({
              success : 'FAIL'
            });  
          }else{
            res.json({
              success : 'OK'
            });
          }
        });
        conn.release();  
    });  
  }
);
//study record 추가
router.post('/users/:user_uid/records/:date',tokenCheck,(req,res)=>{
  const subject_name = req.body.subject_name;
  const date = req.params.date;
  const uid = req.params.user_uid;
  
  const query = "INSERT INTO study_record(user_uid,subject_name,study_time,reg_date) VALUES(?,?,0,?)";
  const checkQuery = "SELECT * FROM study_record WHERE user_uid = ? AND reg_date = ? AND subject_name = ?"

  getConnection((conn)=>{
    conn.query(checkQuery,[uid,date,subject_name],(err,rows)=>{
      if(err || rows.length !==0) {
        res.json({
          success : 'FAIL'
        });  
      }else{
        getConnection((conn)=>{
          conn.query(query,[uid,subject_name,date],(err,rows)=>{
            if(err) {
              console.log(err);
              res.json({
                success : 'FAIL'
              });  
            }else{
              res.json({
                success : 'OK'
              });
            }
          });
          conn.release();
        });    
      }
    });
    conn.release();
  });
  }
);
//study record 삭제
router.delete('/users/:user_uid/records/:date',tokenCheck,(req,res)=>{
  const subject_name = req.body.subject_name;
  const date = req.params.date;
  const uid = req.params.user_uid;
  const query = "DELETE FROM study_record WHERE user_uid = ? AND DATE(reg_date) = ? AND subject_name = ?";
  getConnection((conn)=>{
      conn.query(query,[uid,date,subject_name],(err,rows)=>{
        if(err) {
          res.json({
            success : 'FAIL'
          });  
        }else{
          res.json({
            success : 'OK'
          });
        }
      });
      conn.release();
  });
}

);
module.exports = router;
