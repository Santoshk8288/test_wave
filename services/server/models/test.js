var con = require('./db');
var isset = require('isset');
var encode = require('nodejs-base64-encode');
var moment = require('moment');
var md5 = require('md5');
var formidable = require('formidable')
var fs = require('fs')
var voucher_codes = require('voucher-code-generator');

processQuery = (query)=>{
  return new Promise((resolve, reject) => {
    con.query(query,(error, result)=>{
      if (error) reject(error);
      else resolve(result);
    })
  })
} 

//--add series 
module.exports.addSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var sername = isset(req.body.sername) ? req.body.sername : "";
    var opendate = isset(req.body.opendate) ? req.body.opendate : "";
    var closedate = isset(req.body.closedate) ? req.body.closedate : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!sername) res.json({ status: false, message: 'Series name required.' });
    else if (!opendate) res.json({ status: false, message: 'Open date required.' });
    else if (!closedate) res.json({ status: false, message: 'Close date required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_series (ser_insid, ser_name, ser_opendate, ser_closedate) VALUES ('" + insid + "', '" + sername + "','" + opendate + "','" + closedate + "')";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Test series added successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--create test 
module.exports.createTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var crsid = isset(req.body.crsid) ? req.body.crsid : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var totalques = isset(req.body.totalques) ? req.body.totalques : "";
    var instructions = isset(req.body.instructions) ? req.body.instructions : "";
    var duration = isset(req.body.duration) ? req.body.duration : "";
    var maxmarks = isset(req.body.maxmarks) ? req.body.maxmarks : "";
    var minmarks = isset(req.body.minmarks) ? req.body.minmarks : "";
    var type = isset(req.body.type) ? req.body.type : "";
    var opendate = isset(req.body.opendate) ? req.body.opendate : "";
    var closedate = isset(req.body.closedate) ? req.body.closedate : "";
    var appeardate = isset(req.body.appeardate) ? req.body.appeardate : "";
    var subject = isset(req.body.subject) ? req.body.subject : [];
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!crsid) res.json({ status: false, message: 'Course id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "INSERT INTO tbl_test (test_insid, test_name, test_total_questions, test_instructions, test_duration, test_max_marks, test_min_marks, test_type, test_opendate, test_closedate, test_appeardate, test_status) VALUES ('" + insid + "', '" + name + "', '" + totalques + "', '" + instructions + "', '" + duration + "', '" + maxmarks + "', '" + minmarks + "', '" + type + "', '" + opendate + "', '" + closedate + "', '" + appeardate + "', '0')";
        var testResult = await processQuery(sql1)
        var sql2 = "INSERT INTO tbl_test_course_mm (tcm_testid, tcm_crsid) VALUES ('" + testResult.insertId + "', '" + crsid + "');";
        var result = await processQuery(sql2)
        if (subject) {
          var j = 0;
          for (var i = 0; i < subject.length; i++) {
            var negMarks = isset(subject[i].negMarks) ? subject[i].negMarks : '';
            var sql3 = "INSERT INTO tbl_test_subject_mm (tsmm_testid, tsmm_smid, tsmm_total_questions, tsmm_total_marks, tsmm_negative_marks) VALUES ('" + testResult.insertId + "', '" + subject[i].smid + "', '" + subject[i].totalQues + "', '" + subject[i].totalMarks + "', '" + negMarks + "')";
            var result = await processQuery(sql3)
            j++;
            if (subject.length == j) {
              res.json({ status: true, message: 'Test created successfully.', testid: testResult.insertId });
            }
          }
        } 
        else res.json({ status: true, message: 'Test created successfully.', testid: testResult.insertId });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add test subject
module.exports.addTestSubject = async(req, res)=> {
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var smid = isset(req.body.smid) ? req.body.smid : "";
    var totalQues = isset(req.body.totalQues) ? req.body.totalQues : "";
    var totalMarks = isset(req.body.totalMarks) ? req.body.totalMarks : "";
    var negMarks = isset(req.body.negMarks) ? req.body.negMarks : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_test_subject_mm (tsmm_testid, tsmm_smid, tsmm_total_questions, tsmm_total_marks, tsmm_negative_marks) VALUES ('" + testid + "', '" + smid + "', '" + totalQues + "', '" + totalMarks + "', '" + negMarks + "')";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Subject added successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add test subject question
module.exports.addTestSubjectQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var questions = isset(req.body.questions) ? req.body.questions : [];
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";
    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        if (questions != '') {
          var ids = 0;
          for (var i = 0; i < questions.length; i++) {
            var tsmmid = questions[i].tsmmid;
            ids = ids + ',' + tsmmid;
          }

          var sql = "SELECT * FROM tbl_test_subject_mm AS tsmm JOIN tbl_result AS res ON res.res_testid = tsmm.tsmm_testid WHERE tsmm_id IN (" + ids + ")";
          var result = await processQuery(sql)
          if (result != '') res.json({ status: false, message: 'You can not add question in subject, because test already in used.' });
          else {
            for (var i = 0; i < questions.length; i++) {
              var tqQuery = "DELETE FROM tbl_test_ques_mm WHERE tqm_tsmmid = '" + questions[i].tsmmid + "'";
              var tqResult = await processQuery(tqQuery)
            }

            for (var i = 0; i < questions.length; i++) {
              var tsmmid = questions[i].tsmmid;
              var queid = questions[i].queid;
              var ids = queid[0].id;
              for (var j = 0; j < ids.length; j++) {
                var sql = "INSERT INTO tbl_test_ques_mm (tqm_tsmmid, tqm_queid) VALUES ('" + tsmmid + "', '" + ids[j] + "')";
                var result = await processQuery(sql)
              }
            }
            res.json({ status: true, message: 'Question added successfully.' });
          }
        } 
        else res.json({ status: false, message: 'Questions array required.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add test in series
module.exports.addTestInSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sqlCount = "SELECT tsm_id FROM tbl_test_series_mm WHERE tsm_serid ='" + serid + "' and tsm_testid='" + testid + "'";
        var resultCount = await processQuery(sqlCount)
        if (resultCount != '') res.json({ status: false, message: 'Test already added in same series.' });
        else {
          var sql = "INSERT INTO tbl_test_series_mm (tsm_serid, tsm_testid) VALUES ('" + serid + "', '" + testid + "')";
          var result = await processQuery(sql)
          res.json({ status: true, message: 'Test added in series successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get test list
module.exports.getTestList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var testtype = isset(req.body.testtype) ? req.body.testtype : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var response = [];
        var addQueCount = 0;
        var sql = "SELECT SQL_CALC_FOUND_ROWS * FROM tbl_test WHERE test_insid = '" + insid + "'";
        if (testtype) sql = sql + " AND test_type = '" + testtype + "'";

        sql = sql + " AND test_name LIKE '" + name + "%' ORDER BY test_opendate desc";

        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var testResult = await processQuery(sql + ";" + countQuery)
        if (testResult[0] != '') {
          testResult[0].forEach(async(value, index)=>{
            var query = "SELECT COUNT(tqm.tqm_id) AS addQueCount FROM tbl_test AS test JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_testid = test.test_id JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_tsmmid = tsmm.tsmm_id WHERE test.test_id = '" + value.test_id + "' GROUP BY test.test_id";
            var queryResult = await processQuery(query)
            if (queryResult != '') value['addQueCount'] = queryResult[0].addQueCount
            else value['addQueCount'] = 0
            response.push(value);
            if (testResult[0].length == index + 1) {
              res.json({ status: true, data: response, totalCount: testResult[1] });
            }
          });
        } 
        else res.json({ status: true, data: testResult[0], totalCount: testResult[1] });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get test 
module.exports.getTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "2";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      var response = [];
      if (tokenResult) {
        var testQuery = "SELECT test.*,res.res_id FROM tbl_test AS test JOIN tbl_test_course_mm AS tcm ON tcm.tcm_testid = test.test_id LEFT JOIN tbl_result AS res ON res.res_testid = test.test_id WHERE test_id = " + testid;
        var subQuery = "SELECT tsmm.*,sub.sub_id,sub.sub_name FROM tbl_test_subject_mm AS tsmm JOIN tbl_subject_mm AS mm ON mm.sm_id = tsmm.tsmm_smid JOIN tbl_subject AS sub ON sub.sub_id = mm.sm_subid WHERE tsmm_testid = " + testid;
        var crsQuery = "SELECT cat.cat_id,cm.cm_name,crs.crs_id FROM tbl_test_course_mm AS tcm JOIN tbl_course_institute_mm AS crs ON crs.crs_id = tcm.tcm_crsid JOIN tbl_course_master AS cm ON cm.cm_id = crs.crs_cmid JOIN tbl_course_category AS cat ON cat.cat_cmid = cm.cm_id WHERE tcm.tcm_testid = " + testid;
        var result = await processQuery(testQuery + ';' + subQuery + ';' + crsQuery)
        response = result[0];
        subResult = result[1];
        response[0]['course'] = result[2];
        response[0]['subjects'] = [];
        if (subResult != '') {
          var i = 0;
          subResult.forEach(async(value)=>{
            if (usrtype == 1) var sql = "SELECT que.*,tmm.tqm_id FROM tbl_test_ques_mm AS tmm JOIN tbl_question AS que ON que.que_id = tmm.tqm_queid WHERE tmm.tqm_tsmmid = " + value.tsmm_id;
            else var sql = "SELECT que.que_id, que.que_subid, que.que_description, que.que_optionA, que.que_optionB, que.que_optionC, que.que_optionD, que.que_optionE, que.que_remark,tmm.tqm_id FROM tbl_test_ques_mm AS tmm JOIN tbl_question AS que ON que.que_id = tmm.tqm_queid WHERE tmm.tqm_tsmmid = " + value.tsmm_id;
            var queResult = await processQuery(sql)
            i++;
            value['questions'] = queResult;
            response[0]['subjects'].push(value);
            if (subResult.length == i) {
              res.json({ status: true, data: response });
            }
          });
        } 
        else res.json({ status: true, data: response });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get series List
module.exports.getSeriesList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS * FROM tbl_series WHERE ser_insid = '" + insid + "' AND ser_name LIKE '" + name + "%' ORDER BY ser_id DESC";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;
        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)  
        res.json({ status: true, data: result[0], totalCount: result[1] })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get test series List
module.exports.getTestSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT * FROM tbl_test_series_mm AS ser JOIN tbl_test as test ON test.test_id = ser.tsm_testid WHERE tsm_serid = " + serid;
        var result = await processQuery(sql)
        res.json({ status: true, data: result })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--update test 
module.exports.updateTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var crsid = isset(req.body.crsid) ? req.body.crsid : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var totalques = isset(req.body.totalques) ? req.body.totalques : "";
    var instructions = isset(req.body.instructions) ? req.body.instructions : "";
    var duration = isset(req.body.duration) ? req.body.duration : "";
    var maxmarks = isset(req.body.maxmarks) ? req.body.maxmarks : "";
    var type = isset(req.body.type) ? req.body.type : "";
    var opendate = isset(req.body.opendate) ? req.body.opendate : "";
    var closedate = isset(req.body.closedate) ? req.body.closedate : "";
    var appeardate = isset(req.body.appeardate) ? req.body.appeardate : "";
    var deleteAll = isset(req.body.deleteAll) ? req.body.deleteAll : "0";
    var subject = isset(req.body.subject) ? req.body.subject : [];
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";
    
    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var testQuery = "SELECT test_id FROM tbl_test AS test JOIN tbl_result AS res ON res.res_testid = test.test_id WHERE test_id = " + testid;
        var result = await processQuery(testQuery)
        if (result != '') {
          var sql = "UPDATE tbl_test SET test_opendate = '" + opendate + "', test_closedate = '" + closedate + "', test_appeardate = '" + appeardate + "' WHERE test_id = " + testid;
          var testResult = await processQuery(sql)
          res.json({ status: true, message: 'Test updated successfully.' });
        } 
        else {
          var sql = "UPDATE tbl_test SET test_name = '" + name + "', test_total_questions = '" + totalques + "', test_instructions = '" + instructions + "', test_duration = '" + duration + "', test_max_marks = '" + maxmarks + "', test_type = '" + type + "', test_opendate = '" + opendate + "', test_closedate = '" + closedate + "', test_appeardate = '" + appeardate + "' WHERE test_id = " + testid;
          var testResult = await processQuery(sql)
          if (deleteAll == '1') {
            var sql1 = "UPDATE tbl_test_course_mm SET tcm_crsid = '" + crsid + "' WHERE tcm_testid = " + testid;
            var result1 = await processQuery(sql1)
            if (subject) {
              var subQuery = "SELECT tsmm_id FROM tbl_test_subject_mm WHERE tsmm_testid = '" + testid + "'";
              var subResult = await processQuery(subQuery)
              if (subResult != '') {
                subResult.forEach(async(value)=>{
                  var tqQuery = "DELETE FROM tbl_test_ques_mm WHERE tqm_tsmmid = '" + value.tsmm_id + "'";
                  var tqResult = await processQuery(tqQuery)
                });
              }

              var sql2 = "DELETE FROM tbl_test_subject_mm WHERE tsmm_testid = " + testid;
              var result2 = await processQuery(sql2)
              if (result2) {
                for (var i = 0; i < subject.length; i++) {
                  var sql3 = "INSERT INTO tbl_test_subject_mm (tsmm_testid, tsmm_smid, tsmm_total_questions, tsmm_total_marks, tsmm_negative_marks) VALUES ('" + testid + "', '" + subject[i].smid + "', '" + subject[i].totalQues + "', '" + subject[i].totalMarks + "', '" + subject[i].negMarks + "')";
                  var result3 = await processQuery(sql3)
                }
              }
            }
          }
          res.json({ status: true, message: 'Test updated successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Get Test Instruction 
module.exports.getTestInstruction = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var testtype = isset(req.body.testtype) ? req.body.testtype : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else if (!testtype) res.json({ status: false, message: 'Test type required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        if (testtype == '0') {
          var testQuery = "SELECT test_insid,test_instructions FROM tbl_test WHERE test_id = '" + testid + "' AND test_type = '0' AND test_opendate <= '" + moment.utc().unix() + "'";
          var result = await processQuery(testQuery)
          if (result != '')res.json({ status: true, data: result });
          else res.json({ status: false, message: 'You can not start the test this time.' });
        } 
        else {
          var testQuery = "SELECT test.test_id,test.test_type,test.test_instructions,res.res_id,res.res_status FROM tbl_test AS test LEFT JOIN tbl_result AS res ON res.res_testid = test.test_id AND res.res_usrtype = '" + usrtype + "' AND res.res_stuid = '" + stuid + "' WHERE test.test_id = '" + testid + "' AND test.test_type = '1' AND test.test_opendate <= '" + moment.utc().unix() + "'";
          var result = await processQuery(testQuery)
          if (result != '') res.json({ status: true, data: result });
          else res.json({ status: false, message: 'You can not start the test this time.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Get Test questions 
module.exports.getTestQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var tsmmid = isset(req.body.tsmmid) ? req.body.tsmmid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "2";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!tsmmid) res.json({ status: false, message: 'Test question map id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        if (usrtype == 1) var sql = "SELECT SQL_CALC_FOUND_ROWS que.* FROM tbl_test_ques_mm AS tmm JOIN tbl_question AS que ON que.que_id = tmm.tqm_queid WHERE tmm.tqm_tsmmid = " + tsmmid;
        else var sql = "SELECT SQL_CALC_FOUND_ROWS que.que_id, que.que_subid, que.que_description, que.que_optionA, que.que_optionB, que.que_optionC, que.que_optionD, que.que_optionE, que.que_remark, tmm.tqm_id FROM tbl_test_ques_mm AS tmm JOIN tbl_question AS que ON que.que_id = tmm.tqm_queid WHERE tmm.tqm_tsmmid = " + tsmmid;

        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, data: result[0], totalCount: result[1] })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--delete test 
module.exports.deleteTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "SELECT res_id FROM tbl_result WHERE res_testid = " + testid;
        var result1 = await processQuery(sql1)
        if (result1 != '')res.json({ status: false, message: 'You can not delete test, because student has given the test.' });
        else {
          var sql2 = "DELETE FROM tbl_test_series_mm WHERE tsm_testid = " + testid;
          var result2 = await processQuery(sql2)
          var sql3 = "SELECT * FROM tbl_test_subject_mm WHERE tsmm_testid = " + testid;
          var result3 = await processQuery(sql3)            
          for (var i = 0; i < result3.length; i++) {
            var sql4 = "DELETE FROM tbl_test_ques_mm WHERE tqm_tsmmid = " + result3[i].tsmm_id;
            var result4 = await processQuery(sql4)
          }
          var sql5 = "DELETE FROM tbl_test_subject_mm WHERE tsmm_testid = " + testid;
          var result5 = await processQuery(sql5)
          var sql6 = "DELETE FROM tbl_test WHERE test_id = " + testid;
          var result6 = await processQuery(sql6)
          res.json({ status: true, message: 'Test deleted successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get student news
module.exports.getStudentTestList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var testtype = isset(req.body.testtype) ? req.body.testtype : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var type = isset(req.body.type) ? req.body.type : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else if (!type) res.json({ status: false, message: 'Type of registration required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        if (type == '1') {
          var sql = "SELECT SQL_CALC_FOUND_ROWS tst.*,res.res_id,res.res_status FROM tbl_test AS tst LEFT JOIN tbl_result AS res ON res.res_testid = tst.test_id AND res.res_stuid = '" + stuid + "' JOIN tbl_test_series_mm AS tsm ON tsm.tsm_testid = tst.test_id WHERE tst.test_status = '1' AND tsm.tsm_serid IN (SELECT smm.scmm_crsid FROM tbl_student AS stu LEFT JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id WHERE scmm_type = '1' AND stu_id = '" + stuid + "')";

          if (testtype) sql = sql + " AND tst.test_type = '" + testtype + "'";

          sql = sql + " AND tst.test_appeardate <= '" + moment.utc().unix() + "' AND tst.test_closedate >= '" + moment.utc().unix() + "' AND tst.test_id NOT IN (SELECT tst.test_id FROM tbl_test_series_mm AS tsm JOIN tbl_test AS tst ON tst.test_id = tsm.tsm_testid JOIN tbl_result AS res ON res.res_testid = tst.test_id WHERE tsm.tsm_serid IN (SELECT smm.scmm_crsid FROM tbl_student AS stu LEFT JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id WHERE scmm_type = '1' AND stu_id = '" + stuid + "') AND res.res_stuid = '" + stuid + "'";

          if (testtype == "0") sql = sql + " AND tst.test_type != '0'";

          sql = sql + " AND res.res_status = '1') GROUP BY tst.test_id ORDER BY tst.test_opendate desc";
        } 
        else {
          var sql = "SELECT SQL_CALC_FOUND_ROWS tst.*,res.res_id,res.res_status FROM tbl_test_course_mm AS tcm JOIN tbl_test AS tst ON tst.test_id = tcm.tcm_testid JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_testid = tst.test_id JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_tsmmid = tsmm.tsmm_id LEFT JOIN tbl_result AS res ON res.res_testid = tst.test_id AND res.res_stuid = '" + stuid + "' WHERE tcm.tcm_crsid IN (SELECT smm.scmm_crsid FROM tbl_student AS stu LEFT JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id WHERE scmm_type = '0' AND stu_id = '" + stuid + "')";
          if (testtype) sql = sql + " AND tst.test_type = '" + testtype + "'";

          sql = sql + " AND tst.test_status = '1' AND tst.test_appeardate <= '" + moment.utc().unix() + "' AND tst.test_closedate >= '" + moment.utc().unix() + "' AND tst.test_id NOT IN (SELECT tst.test_id FROM tbl_test_course_mm AS tcm JOIN tbl_test AS tst ON tst.test_id = tcm.tcm_testid JOIN tbl_result AS res ON res.res_testid = tst.test_id WHERE tcm.tcm_crsid IN (SELECT smm.scmm_crsid FROM tbl_student AS stu LEFT JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id WHERE scmm_type = '0' AND stu_id = '" + stuid + "') AND res.res_stuid = '" + stuid + "'";
          if (testtype == "0") sql = sql + " AND tst.test_type != '0'";

          sql = sql + " AND res.res_status = '1') GROUP BY tst.test_id ORDER BY tst.test_opendate desc";
        }

        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        if (result[0] != '') res.json({ status: true, data: result });
        else res.json({ status: false, message: 'Test not found.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--start test 
module.exports.startTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else if (!usrtype) res.json({ status: false, message: 'User type id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_result (res_testid, res_stuid, res_status, res_usrtype, res_createdate, res_updatedate) VALUES ('" + testid + "', '" + stuid + "', '0', '" + usrtype + "', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Test started successfully.', resid: result.insertId });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--save answer
module.exports.updateAnswer = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var tqmid = isset(req.body.tqmid) ? req.body.tqmid : "";
    var ans = isset(req.body.ans) ? req.body.ans : "";
    var ansStatus = isset(req.body.ansStatus) ? req.body.ansStatus : "0";
    var time = isset(req.body.time) ? req.body.time : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else if (!tqmid) res.json({ status: false, message: 'Test question mapped id required.' });
    else if (!time) res.json({ status: false, message: 'Time required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var query = "SELECT * FROM tbl_result_detail WHERE rd_resid = '" + resid + "' AND rd_tqmid = '" + tqmid + "'";
        var queryResult = await processQuery(query)
        if (queryResult != '') {
          var sql = "UPDATE tbl_result_detail SET rd_usr_ans = '" + ans + "', rd_status = '" + ansStatus + "' WHERE rd_resid = '" + resid + "' AND rd_tqmid = '" + tqmid + "'";
          var result = await processQuery(sql)
          if (result) {
            var resQuery = "UPDATE tbl_result SET res_time = '" + time + "', res_updatedate = '" + moment.utc().unix() + "' WHERE res_id = " + resid;
            var resQueryResult = await processQuery(resQuery)
            res.json({ status: true, message: 'Answer updated successfully.' });
          } 
          else res.json({ status: false, message: 'Something went wrong.' });
        } 
        else {
          var sql = "INSERT INTO tbl_result_detail (rd_resid, rd_tqmid, rd_usr_ans, rd_status) VALUES ('" + resid + "', '" + tqmid + "', '" + ans + "', '" + ansStatus + "')";
          var result = await processQuery(sql)
          if (result) {
            var resQuery = "UPDATE tbl_result SET res_time = '" + time + "', res_updatedate = '" + moment.utc().unix() + "' WHERE res_id = " + resid;
            var resQueryResult = await processQuery(resQuery)
            res.json({ status: true, message: 'Answer updated successfully.' });
          } 
          else res.json({ status: false, message: 'Something went wrong.' });
         
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

var resultData = [];

//--Submit Test
module.exports.submitTest = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var time = isset(req.body.time) ? req.body.time : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT COUNT(rd_id) AS attemptQues FROM tbl_result_detail WHERE rd_resid = '" + resid + "'";
        var result = await processQuery(sql)
        callback(result[0]);
        var rightAnswer = 0;
        var markObtain = 0;
        var posMark = 0;
        var negMark = 0;
        var sql1 = "SELECT * FROM tbl_result_detail WHERE rd_resid = '" + resid + "'";
        var result1 = await processQuery(sql1)
        if (result1 != '') {
          var i = 0;
          result1.forEach(async(value)=>{
            var sql2 = "SELECT COUNT(*) AS count FROM tbl_question AS que JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_queid = que.que_id WHERE tqm.tqm_id = '" + value.rd_tqmid + "' AND que.que_answer = '" + value.rd_usr_ans + "'";
            var result2 = await processQuery(sql2)
            i++;
            rightAnswer = rightAnswer + result2[0].count;
            if (result1.length == i) {
              callback({ rightAnswer: rightAnswer });
            }
          });

          //-- for count total obtained marks
          var j = 0;
          result1.forEach(async(value)=>{
            var sql3 = "SELECT (tsmm.tsmm_total_marks/tsmm.tsmm_total_questions) AS mark, tsmm.tsmm_negative_marks ,que.que_id FROM tbl_test_ques_mm AS tqm LEFT JOIN tbl_question AS que ON que.que_id = tqm.tqm_queid AND que_answer = '" + value.rd_usr_ans + "' LEFT JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_id = tqm.tqm_tsmmid WHERE tqm.tqm_id = '" + value.rd_tqmid + "'";
            var result3 = await processQuery(sql3)
            j++;
            if (result3[0].que_id) posMark = posMark + result3[0].mark;
            else negMark = negMark + result3[0].tsmm_negative_marks;

            if (result1.length == j) {
              markObtain = posMark - negMark;
              callback({ markObtain: markObtain });
            }
          });
        } 
        else {
          callback({ rightAnswer: 0 });
          callback({ markObtain: 0 });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Get get Test Question Answer 
module.exports.getTestQuestionAnswer = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var tqmid = isset(req.body.tqmid) ? req.body.tqmid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else if (!tqmid) res.json({ status: false, message: 'Test question id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT * FROM tbl_result_detail WHERE rd_resid = '" + resid + "' AND rd_tqmid = '" + tqmid + "'";
        var result = await processQuery(sql)
        res.json({ status: true, data: result })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- show user test result list
module.exports.getStudentResultHistory = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : ""; //when usrtype 3 then take gstid
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var testtype = isset(req.body.testtype) ? req.body.testtype : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS res.res_id,res.res_testid,res.res_total_attempt,res.res_correct_answer,res.res_marks_abtain,res.res_createdate,test.test_max_marks,test.test_name,test.test_type FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res_stuid = '" + stuid + "' AND res_status = '1' AND res_usrtype = '" + usrtype + "'";
        if (testtype) sql = sql + " AND test_type = '" + testtype + "'";

        if (testid) sql = sql + " AND res_testid = '" + testid + "'";

        sql = sql + " ORDER BY res_updatedate DESC";

        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, data: result })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- show user test result
module.exports.showResult = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      var count = 0;
      var response = [];
      if (tokenResult) {
        var sql1 = "SELECT res.*,test.test_name,test.test_total_questions,test.test_duration,test.test_max_marks,test.test_min_marks,test.test_type FROM tbl_result AS res JOIN tbl_result_detail AS rd ON rd.rd_resid = res.res_id JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res.res_id = '" + resid + "' AND res.res_status = '1' GROUP BY res_id";
        var result1 = await processQuery(sql1)
        if (result1 != '') {
          var sql2 = "SELECT tsmm.*,sub.sub_name FROM tbl_test_subject_mm AS tsmm JOIN tbl_subject_mm AS mm ON mm.sm_id = tsmm.tsmm_smid JOIN tbl_subject AS sub ON sub.sub_id = mm.sm_subid JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_tsmmid = tsmm.tsmm_id WHERE tsmm_testid = '" + result1[0].res_testid + "' GROUP BY tsmm.tsmm_id";
          var result2 = await processQuery(sql2)
          var i = result2.length - 1;
          result2.forEach(async(value, index)=>{
            var sql3 = "SELECT COUNT(*) AS attemptQues FROM tbl_result AS res JOIN tbl_result_detail AS rd ON rd.rd_resid = res.res_id JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_id = rd.rd_tqmid WHERE tqm.tqm_tsmmid = '" + value.tsmm_id + "' AND res.res_id = '" + resid + "'";
            var sql4 = "SELECT tqm.tqm_queid,rd.rd_usr_ans FROM tbl_result AS res LEFT JOIN tbl_result_detail AS rd ON rd.rd_resid = res.res_id LEFT JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_id = rd.rd_tqmid AND tqm.tqm_tsmmid = '" + value.tsmm_id + "' WHERE res.res_id = '" + resid + "'";
            var result3 = await processQuery(sql3 + ";" + sql4)
            value.attemptQues = result3[0][0].attemptQues
            var totalCount = await getQuestionCount(result3[1], res)
            value.rightAns = totalCount
            response.push(value)
            result1[0]['subject'] = response;
            if (index == i) res.json({ status: true, data: result1 })
          })
        } 
        else res.json({ status: false, message: 'Result not found.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- delete series
module.exports.deleteSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "SELECT * FROM tbl_test_series_mm WHERE tsm_serid = '" + serid + "'";
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'You can not delete test series, because it is already mapped with test.' });
        else {
          var sql2 = "DELETE FROM tbl_series WHERE ser_id = '" + serid + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Series deleted successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- Delete Test Subject Question
module.exports.deleteTestSubjectQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var tqmid = isset(req.body.tqmid) ? req.body.tqmid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!tqmid) res.json({ status: false, message: 'Test question map id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "SELECT res.res_id FROM tbl_test_ques_mm AS tqm JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_id = tqm.tqm_tsmmid JOIN tbl_result AS res ON res.res_testid = tsmm.tsmm_testid WHERE tqm_id = '" + tqmid + "'";
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'You can not delete this question, because it is already in used.' });
        else {
          var sql2 = "DELETE FROM tbl_test_ques_mm WHERE tqm_id = '" + tqmid + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Question deleted successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Get Student Test Series List
module.exports.getStudentTestSeriesList = async(req, res)=> {
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT ser.ser_id,ser.ser_name FROM tbl_student_course_mm AS scmm JOIN tbl_test_course_mm AS tcm ON tcm.tcm_crsid = scmm.scmm_crsid JOIN tbl_test_series_mm AS tsm ON tsm.tsm_testid = tcm.tcm_testid JOIN tbl_series AS ser ON ser.ser_id = tsm.tsm_serid WHERE scmm.scmm_stuid = '" + stuid + "' GROUP BY ser_id";
        var result = await processQuery(sql)
        res.json({ status: true, data: result })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--upload question image
module.exports.uploadQuestionImage = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
    var returnName = '';
    var url = '';
    if (isset(files.upload)) {
      var old_path = files.upload.path,
        file_size = files.upload.size,
        file_ext = files.upload.name.split('.').pop(),
        index = old_path.lastIndexOf('/') + 1,
        name = 'uploads/queImage/' + moment.utc().unix() + '.' + file_ext;

      fs.readFile(old_path, function(err, data) {
        fs.writeFile('./' + name, data, function(err) {
          if (err)
            res.json({ status: false, message: 'Error in uploading image, Please try again.' });
          else {
            url = 'http://192.168.88.83/test_wave/server/' + name; //for staing

            //url = 'http://192.168.88.2:8434/testwave/services/server/'+name;//for staing

            //url = 'http://www.testwave.in/services/server/'+name;//for live

            returnName = '<script type="text/javascript"> window.parent.CKEDITOR.tools.callFunction("0", "' + url + '", "")</script>';
            res.send(returnName);
          }
        });
      });
    } else {
      res.json({ status: false, message: 'Error in getting image, Please try again.' });
    }
    //  }       
    //  else
    //  {
    //      res.json({ status : false, message : 'Token expired.' });
    //  }
    // });
    // }
  })
}

//--Get Test Question Detail 
module.exports.getTestQuestionDetail = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var tqmid = isset(req.body.tqmid) ? req.body.tqmid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else if (!tqmid) res.json({ status: false, message: 'Test question id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var queQuery = "SELECT rd.*,tqm.tqm_id, que.que_id, que.que_description, que.que_optionA, que.que_optionB, que.que_optionC, que.que_optionD, que.que_optionE, que.que_remark,tsmm.tsmm_smid FROM tbl_result_detail AS rd JOIN tbl_test_ques_mm AS tqm ON tqm.tqm_id = rd.rd_tqmid JOIN tbl_question AS que ON que.que_id = tqm.tqm_queid JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_id = tqm.tqm_tsmmid WHERE rd_resid = '" + resid + "' AND rd_tqmid = '" + tqmid + "'";
        var result = await processQuery(queQuery)
        if (result != '') res.json({ status: true, data: result })
        else res.json({ status: false, message: 'Question does not exists.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Get Test Result Detail
module.exports.getTestResultDetail = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var resid = isset(req.body.resid) ? req.body.resid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!resid) res.json({ status: false, message: 'Result id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "SELECT * FROM tbl_result WHERE res_id = '" + resid + "'";
        var sql2 = "SELECT * FROM tbl_result_detail WHERE rd_resid   = '" + resid + "'";
        var result = await processQuery(sql1 + ";" + sql2)
        if (result[0] != '') {
          response = result[0];
          response[0]['resultDetail'] = result[1];
          res.json({ status: true, data: response })
        } 
        else res.json({ status: false, message: 'Result details do not exists.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add test feedback
module.exports.addTestFeedback = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var rating = isset(req.body.rating) ? req.body.rating : "";
    var comment = isset(req.body.comment) ? req.body.comment : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_feedback (feed_stuid, feed_testid, feed_rating,feed_comment) VALUES ('" + stuid + "', '" + testid + "', '" + rating + "', '" + comment + "')";
        var result = await processQuery(sql)
        res.json({ status: false, message: 'Something went wrong.' });
      } 
      else es.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get test feedback
module.exports.getTestFeedback = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS feed.*, stu.stu_fname,stu.stu_lname,stu.stu_email FROM tbl_feedback AS feed JOIN tbl_student AS stu ON stu.stu_id = feed.feed_stuid WHERE stu.stu_insid = '" + insid + "'";
        if (testid) sql = sql + " AND feed.feed_testid = '" + testid + "'";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, data: result });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--edit series 
module.exports.editSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var sername = isset(req.body.sername) ? req.body.sername : "";
    var opendate = isset(req.body.opendate) ? req.body.opendate : "";
    var closedate = isset(req.body.closedate) ? req.body.closedate : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else if (!sername) res.json({ status: false, message: 'Series name required.' });
    else if (!opendate) res.json({ status: false, message: 'Open date required.' });
    else if (!closedate) res.json({ status: false, message: 'Close date required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "UPDATE tbl_series SET ser_name = '" + sername + "', ser_opendate = '" + opendate + "', ser_closedate = '" + closedate + "' WHERE ser_id = '" + serid + "'";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Test series updated successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Change Test Staus
module.exports.changeTestStaus = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var status = isset(req.body.status) ? req.body.status : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else if (!status) res.json({ status: false, message: 'Status required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "UPDATE tbl_test SET test_status = '" + status + "' WHERE test_id = '" + testid + "'";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Test status updated successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get results of a test
module.exports.getResultsOfTest = async(req, res)=> {
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var testid = isset(req.body.testid) ? req.body.testid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!testid) res.json({ status: false, message: 'Test id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS res.*, stu.stu_fname,stu.stu_lname FROM tbl_result AS res JOIN tbl_student AS stu ON stu.stu_id = res.res_stuid WHERE res.res_testid = '" + testid + "' ORDER BY res_marks_abtain DESC";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, data: result });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

module.exports.generateCouponForSeries = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var insname = isset(req.body.insname) ? req.body.insname : "";
    var count = isset(req.body.count) ? req.body.count : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!insname) res.json({ status: false, message: 'Institute name required.' });
    else if (!count) res.json({ status: false, message: 'Count required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var couponArray = voucher_codes.generate({
          prefix: insname.substring(0, 3),
          postfix: "-" + insid,
          length: 8,
          count: count,
        });

        var j = 0;
        for (var i = 0; i < couponArray.length; i++) {
          var sql = "INSERT INTO tbl_coupon (cou_serid, cou_code, cou_status) VALUES ('" + serid + "', '" + couponArray[i] + "', '0')";
          var result  = await processQuery(sql)
          j++;
          if (couponArray.length == j) {
            var sql1 = "SELECT MAX(cd_end_index) as endIndex FROM tbl_coupon_details";
            var result1 = await processQuery(sql1)
            if (result1[0].endIndex) var endIndex = result1[0].endIndex + 1;
            else var endIndex = 1;

            var sql2 = "INSERT INTO tbl_coupon_details (cd_serid,cd_count,cd_start_index,cd_end_index,cd_date) VALUES ('" + serid + "','" + count + "','" + endIndex + "','" + result.insertId + "', '" + moment.utc().unix() + "')";
            var result2 = await processQuery(sql2)
            res.json({ status: true, message: 'Coupon added successfully' });
          }
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

module.exports.getSeriesCouponList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS * FROM tbl_coupon_details WHERE cd_serid = '" + serid + "'";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, date: result });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

module.exports.getCoupons = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var startIndex = isset(req.body.startIndex) ? req.body.startIndex : "";
    var endIndex = isset(req.body.endIndex) ? req.body.endIndex : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else if (!startIndex) res.json({ status: false, message: 'Start index required.' });
    else if (!endIndex) res.json({ status: false, message: 'End index required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS * FROM tbl_coupon WHERE cou_serid = '" + serid + "' AND cou_id >= '" + startIndex + "' AND cou_id <= '" + endIndex + "'";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;

        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, date: result });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

module.exports.deleteCoupons = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var cdid = isset(req.body.cdid) ? req.body.cdid : "";
    var serid = isset(req.body.serid) ? req.body.serid : "";
    var startIndex = isset(req.body.startIndex) ? req.body.startIndex : "";
    var endIndex = isset(req.body.endIndex) ? req.body.endIndex : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!cdid) res.json({ status: false, message: 'Coupon detail id required.' });
    else if (!serid) res.json({ status: false, message: 'Series id required.' });
    else if (!startIndex) res.json({ status: false, message: 'Start index required.' });
    else if (!endIndex) res.json({ status: false, message: 'End index required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql1 = "SELECT * FROM tbl_coupon AS cou JOIN tbl_guest_user AS gst ON gst.gst_coupon = cou.cou_code WHERE cou_serid = '" + serid + "' AND cou_id >= '" + startIndex + "' AND cou_id <= '" + endIndex + "'";
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'Coupon does not delete because already used.' });
        else {
          var sql1 = "DELETE FROM tbl_coupon_details WHERE cd_id = '" + cdid + "'";
          var result1 = await processQuery(sql1)
          var sql2 = "DELETE FROM tbl_coupon WHERE cou_serid = '" + serid + "' AND cou_id >= '" + startIndex + "' AND cou_id <= '" + endIndex + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Coupon delete successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get guest user test LIst
module.exports.getGuestUserTestList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var gstid = isset(req.body.gstid) ? req.body.gstid : "";
    var testtype = isset(req.body.testtype) ? req.body.testtype : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var usrtype = isset(req.body.usrtype) ? req.body.usrtype : "3";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!gstid) res.json({ status: false, message: 'Guest user id required.' });
    else {
      var tokenResult = await verifyToken(token, usrtype)
      if (tokenResult) {
        var sql = "SELECT cou_serid FROM tbl_guest_user AS gst JOIN tbl_coupon AS cou ON cou.cou_code = gst.gst_coupon JOIN tbl_series AS ser ON ser.ser_id = cou.cou_serid WHERE gst_id = '" + gstid + "' AND ser.ser_opendate <= '" + moment.utc().unix() + "' AND ser.ser_closedate >= '" + moment.utc().unix() + "'";
        var result = await processQuery(sql)
        if (result != '') {
          var sql = "SELECT SQL_CALC_FOUND_ROWS tst.*,res.res_id,res.res_status FROM tbl_test_series_mm AS tsm JOIN tbl_test AS tst ON tst.test_id = tsm.tsm_testid LEFT JOIN tbl_result AS res ON res.res_testid = tst.test_id AND res.res_usrtype = '" + usrtype + "' AND res.res_stuid = '" + gstid + "' WHERE tst.test_status = '1' AND tsm.tsm_serid = '" + result[0].cou_serid + "'";

          if (testtype) sql = sql + " AND tst.test_type = '" + testtype + "'";

          sql = sql + " AND tst.test_appeardate <= '" + moment.utc().unix() + "' AND tst.test_closedate >= '" + moment.utc().unix() + "' AND tst.test_id NOT IN (SELECT tst.test_id FROM tbl_test_series_mm AS tsm JOIN tbl_test AS tst ON tst.test_id = tsm.tsm_testid JOIN tbl_result AS res ON res.res_testid = tst.test_id WHERE res.res_usrtype = '" + usrtype + "' AND tsm.tsm_serid = '" + result[0].cou_serid + "' AND res.res_stuid = '" + gstid + "'";

          if (testtype == "0") sql = sql + " AND tst.test_type != '0'";

          sql = sql + " AND res.res_status = '1') GROUP BY tst.test_id ORDER BY tst.test_opendate desc";

          if (start || end) sql = sql + " LIMIT " + start + " , " + end;

          var countQuery = "SELECT FOUND_ROWS() AS totalCount";
          var result = await processQuery(sql + ";" + countQuery)
          if (result[0] != '') res.json({ status: true, data: result });
          else res.json({ status: false, message: 'Test not found.' });
        } 
        else res.json({ status: false, message: 'Test not found.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    console.log('Something went wrong.');
  }
}

//--method for verify token
var verifyToken = function(token, usrtype) {
  return new Promise(async(resolve, reject) => {
    try{
      if (usrtype == '3') {
        var hash = encode.decode(token, 'base64')
        var hashArray = hash.split(":");
        var md5Hash = md5('testwave:' + hashArray[1] + ':&S9#:@plite:2017');
        var sql = "SELECT * FROM tbl_guest_user WHERE gst_id = '" + hashArray[1] + "' AND gst_token = '" + token + "'";
        var result = await processQuery(sql)
        if (result.length == 1 && md5Hash == hashArray[2]) resolve(true);
        else resolve(false);
      } 
      else {
        var hash = encode.decode(token, 'base64')
        var hashArray = hash.split(":");
        var md5Hash = md5('testwave:' + hashArray[1] + ':&S9#:@plite:2017');
        var sql = "SELECT * FROM tbl_user WHERE usr_id = '" + hashArray[1] + "' AND usr_token = '" + token + "'";
        var result = await processQuery(sql)
        if (result.length == 1 && md5Hash == hashArray[2]) resolve(true);
        else resolve(false);
      }
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })
}

var callback = async(temp)=>{
  resultData.push(temp);
  if (resultData.length == 3) {
    try{
      var query = "UPDATE tbl_result SET res_total_attempt = '" + resultData[0].attemptQues + "', res_correct_answer = '" + resultData[1].rightAnswer + "', res_marks_abtain = '" + resultData[2].markObtain + "', res_status = '1', res_time = '" + time + "', res_updatedate = '" + moment.utc().unix() + "' WHERE res_id = " + resid;
      var result = await processQuery(query)
      resultData = [];
      res.json({ status: true, message: 'Test submitted successfully.' });
    }
    catch(error){
      console.log('Something went wrong.');
    }
  }
}

var getQuestionCount = function(data, res) {
  return new Promise(async(resolve, reject) => {
    try{
      var count = 0;
      var i = 0;
      data.forEach(async(queValue)=>{
        var sql = "SELECT que_id FROM tbl_question WHERE que_id = '" + queValue.tqm_queid + "' AND que_answer = '" + queValue.rd_usr_ans + "'";
        var result = await processQuery(sql)
        i++;
        if (result != '') count++
        if (data.length == i) resolve(count);
      })
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })
}