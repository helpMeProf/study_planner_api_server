const express = require('express');
const getConnection = require('../db/dbUtils.js');
const router = express.Router();

/* GET home page. */

//알맞은 user의 데이터만 가져오기 
router.get('/users/:user_uid/records/:date',(req,res)=>{
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
router.put('/users/:user_uid/records/:date',(req,res)=>{
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
router.post('/users/:user_uid/records/:date',(req,res)=>{
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
router.delete('/users/:user_uid/records/:date',(req,res)=>{
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
