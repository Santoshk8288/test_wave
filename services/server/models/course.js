var con = require('./db');
var isset = require('isset');
var encode = require('nodejs-base64-encode');
var moment = require('moment');
var md5 = require('md5');

processQuery = (query)=>{
  return new Promise((resolve, reject) => {
    con.query(query,(error, result)=>{
      if (error) reject(error);
      else resolve(result);
    })
  })
} 

//--get course list 
module.exports.getCourseList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "SELECT cm_id, cm_name FROM tbl_course_master WHERE cm_status = 0 AND cm_id NOT IN (SELECT crs_cmid FROM tbl_course_institute_mm WHERE crs_insid = '" + insid + "')";
        var result = await processQuery(sql)
        res.json({ status: true, data: result });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add course 
module.exports.addCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var crsname = isset(req.body.crsname) ? req.body.crsname : "";
    var cmids = isset(req.body.cmids) ? JSON.parse(req.body.cmids) : [];
    
    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        if (crsname) {
          var sql = "INSERT INTO tbl_course_master (cm_name, cm_status) VALUES ('" + crsname + "', '1')";
          var result = await processQuery(sql)
          var sql = "INSERT INTO tbl_course_institute_mm (crs_cmid, crs_insid) VALUES ('" + result.insertId + "', '" + insid + "');";
          var crsResult = await processQuery(sql)
          var sql = "INSERT INTO tbl_course_category (cat_cmid, cat_name, cat_description) VALUES ('" + result.insertId + "', '" + crsname + "', '" + crsname + "');";
          var catResult = await processQuery(sql)
          res.json({ status: true, message: 'Course added successfully.', catid: catResult.insertId });
        } 
        else {
          if (cmids != '') {
            var j = 0;
            for (var i = 0; i < cmids.length; i++) {
              var result = checkCourseExist(insid, cmids[i].cmid)
              if (result) {
                j++;
                if (cmids.length == j) {
                  res.json({ status: true, message: 'Course added successfully.' });
                }
              } 
              else res.json({ status: false, message: 'Something went wrong.' });
            }
          } else
            res.json({ status: false, message: 'Please enter course name or course mapped id.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get institute course list 
module.exports.getInstituteCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var i = 0;
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS mst.cm_name, mst.cm_status, mm.* FROM tbl_course_institute_mm AS mm JOIN tbl_course_master AS mst ON mst.cm_id = mm.crs_cmid WHERE mm.crs_insid = '" + insid + "' AND mst.cm_name LIKE '" + name + "%'";
        if (start || end) sql = sql + " LIMIT " + start + " , " + end;
        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var crsResult = await processQuery(sql + ";" + countQuery)
        var response = [];
        if (crsResult[0] != '') {
          crsResult[0].forEach(async(value)=>{
            var sql = "SELECT * FROM tbl_course_category WHERE cat_cmid = " + value.crs_cmid;
            var catResult = await processQuery(sql)
            i++;
            value['category'] = catResult;
            response.push(value);
            if (crsResult[0].length == i) {
              res.json({ status: true, data: response, totalCount: crsResult[1] });
            }
          })
        } 
        else res.json({ status: false, message: 'No course found, Please add course.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get subject list 
module.exports.getSubjectList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "SELECT SQL_CALC_FOUND_ROWS sub_id as subid,sub_name,sub_insid FROM `tbl_subject` WHERE (sub_insid = '" + insid + "' OR sub_insid = '0') AND sub_name LIKE '" + name + "%'";
        if (start || end) sql = sql + "LIMIT " + start + " , " + end;
        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(sql + ";" + countQuery)
        res.json({ status: true, data: result[0], totalCount: result[1] });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add subject 
module.exports.addSubject = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var subname = isset(req.body.subname) ? req.body.subname : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_subject (sub_name, sub_insid) VALUES ('" + subname + "', '" + insid + "');";
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

//--add course 
module.exports.editSubject = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var subid = isset(req.body.subid) ? req.body.subid : "";
    var subname = isset(req.body.subname) ? req.body.subname : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!subid) res.json({ status: false, message: 'Subject id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "UPDATE tbl_subject SET sub_name = '" + subname + "' WHERE sub_id = '" + subid + "'";
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Subject updated successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add subject in course 
module.exports.addSubjectInCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var catid = isset(req.body.catid) ? req.body.catid : "";
    var subject = isset(req.body.subject) ? req.body.subject : [];
    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!catid) res.json({ status: false, message: 'Category id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var query = "SELECT * FROM tbl_course_category AS cat JOIN tbl_course_master AS mst ON mst.cm_id = cat.cat_cmid WHERE cat_id = '" + catid + "' AND mst.cm_status = '0'";
        var queryResult = await processQuery(query)
        if (queryResult != '') res.json({ status: false, message: 'You are not eligible to do any change in this category.' });
        else {
          var sql1 = "SELECT * FROM tbl_subject_mm AS mm JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_smid = mm.sm_id WHERE sm_catid = " + catid;
          var result1 = await processQuery(sql1)
          if (result1 != '') res.json({ status: false, message: 'You can not add or delete subjects in course, because already used in test.' });
          else {
            if (subject != '') {
              var sql2 = "DELETE FROM tbl_subject_mm WHERE sm_catid = '" + catid + "'";
              var result2 = await processQuery(sql2)
              if (result2) {
                for (var i = 0; i < subject.length; i++) {
                  var sql3 = "INSERT INTO tbl_subject_mm (sm_catid, sm_subid) VALUES ('" + catid + "', '" + subject[i].subid + "');";
                  var result3 = await processQuery(sql3)
                }
                res.json({ status: true, message: 'Subject added in course successfully.' });
              } 
              else res.json({ status: false, message: 'Something went wrong.' });
            } 
            else res.json({ status: false, message: 'Error in getting subject details, Please try again.' });
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

//--get tag
module.exports.getTagList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "SELECT * FROM tbl_tag WHERE tag_insid = " + insid;
        var tagResult = await processQuery(sql)
        res.json({ status: true, data: tagResult });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--add question 
module.exports.addQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var subid = isset(req.body.subid) ? req.body.subid : "";
    var desc = isset(req.body.desc) ? req.body.desc : "";
    var optionA = isset(req.body.optionA) ? req.body.optionA : "";
    var optionB = isset(req.body.optionB) ? req.body.optionB : "";
    var optionC = isset(req.body.optionC) ? req.body.optionC : "";
    var optionD = isset(req.body.optionD) ? req.body.optionD : "";
    var optionE = isset(req.body.optionE) ? req.body.optionE : "";
    var ans = isset(req.body.ans) ? req.body.ans : "";
    var remark = isset(req.body.remark) ? req.body.remark : "";
    var queTag = isset(req.body.tag) ? req.body.tag : [];

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!subid) res.json({ status: false, message: 'Subject id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "INSERT INTO tbl_question (que_insid, que_subid, que_description, que_optionA, que_optionB, que_optionC, que_optionD, que_optionE, que_answer, que_remark, que_createdate, que_updatedate) VALUES ('" + insid + "', '" + subid + "', '" + desc + "', '" + optionA + "', '" + optionB + "', '" + optionC + "', '" + optionD + "', '" + optionE + "', '" + ans + "', '" + remark + "', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
        var queResult = await processQuery(sql)
        if (queTag != '') {
          for (var i = 0; i < queTag.length; i++) {
            if (queTag[i].tagid) {
              var sql = "INSERT INTO tbl_tag_connection (con_tagid, con_queid) VALUES ('" + queTag[i].tagid + "', '" + queResult.insertId + "')";
              var result = await processQuery(sql)
            } 
            else {
              var sql = "INSERT INTO tbl_tag (tag_insid, tag_name) VALUES('" + insid + "', '" + queTag[i].tagname + "')";
              var result = await processQuery(sql)
              var sql = "INSERT INTO tbl_tag_connection (con_tagid, con_queid) VALUES ('" + result.insertId + "', '" + queResult.insertId + "')";
              var result = await processQuery(sql)
            }
          }
          res.json({ status: true, message: 'Question added successfully.' });
        } 
        else res.json({ status: true, message: 'Question added successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--update question 
module.exports.updateQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var queid = isset(req.body.queid) ? req.body.queid : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var subid = isset(req.body.subid) ? req.body.subid : "";
    var desc = isset(req.body.desc) ? req.body.desc : "";
    var optionA = isset(req.body.optionA) ? req.body.optionA : "";
    var optionB = isset(req.body.optionB) ? req.body.optionB : "";
    var optionC = isset(req.body.optionC) ? req.body.optionC : "";
    var optionD = isset(req.body.optionD) ? req.body.optionD : "";
    var optionE = isset(req.body.optionE) ? req.body.optionE : "";
    var ans = isset(req.body.ans) ? req.body.ans : "";
    var remark = isset(req.body.remark) ? req.body.remark : "";
    var queTag = isset(req.body.tag) ? req.body.tag : [];
    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!subid) res.json({ status: false, message: 'Subject id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "UPDATE tbl_question SET que_subid = '" + subid + "', que_description = '" + desc + "', que_optionA = '" + optionA + "', que_optionB = '" + optionB + "', que_optionC = '" + optionC + "', que_optionD = '" + optionD + "', que_optionE = '" + optionE + "', que_answer = '" + ans + "', que_remark = '" + remark + "', que_updatedate = '" + moment.utc().unix() + "' WHERE que_id = '" + queid + "'";
        var queResult = await processQuery(sql)
        var sql = "DELETE FROM tbl_tag_connection WHERE con_queid = " + queid;
        var result = await processQuery(sql)
        if (queTag) {
          for (var i = 0; i < queTag.length; i++) {
            if (queTag[i].tagid) {
              var sql = "INSERT INTO tbl_tag_connection (con_tagid, con_queid) VALUES ('" + queTag[i].tagid + "', '" + queid + "')";
              var result = await processQuery(sql)
            } 
            else {
              var sql = "INSERT INTO tbl_tag (tag_insid, tag_name) VALUES('" + insid + "', '" + queTag[i].tagname + "')";
              var result = await processQuery(sql)
              var sql = "INSERT INTO tbl_tag_connection (con_tagid, con_queid) VALUES ('" + result.insertId + "', '" + queid + "')";
              var result = await processQuery(sql)
            }
          }
        }
        res.json({ status: true, message: 'Question updated successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get question list 
module.exports.getQuestionList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var subid = isset(req.body.subid) ? req.body.subid : "";
    var desc = isset(req.body.desc) ? req.body.desc : "";
    var searchBy = isset(req.body.searchBy) ? req.body.searchBy : ""; //0 for description of question and 1 for tag name

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var queQuery = "SELECT SQL_CALC_FOUND_ROWS que.que_id,que.que_subid, que.que_description, que.que_optionA, que.que_optionB, que.que_optionC, que.que_optionD, que.que_optionE, que.que_answer, que.que_remark,sub.sub_name,tag.tag_id,tag.tag_name FROM tbl_question AS que JOIN tbl_subject AS sub on sub.sub_id = que.que_subid LEFT JOIN tbl_tag_connection AS con ON con.con_queid = que.que_id LEFT JOIN tbl_tag AS tag ON tag.tag_id = con.con_tagid WHERE que.que_insid = '" + insid + "'";
        if (searchBy == '0') queQuery = queQuery + " AND que.que_description LIKE '%" + desc + "%'";
        if (searchBy == '1' && desc) queQuery = queQuery + " AND tag.tag_name LIKE '%" + desc + "%'";
        if (subid) queQuery = queQuery + " AND que.que_subid = '" + subid + "'";
        queQuery = queQuery + " GROUP BY que.que_id";
        if (start || end) queQuery = queQuery + " LIMIT " + start + " , " + end;
        var countQuery = "SELECT FOUND_ROWS() AS totalCount";
        var result = await processQuery(queQuery + ";" + countQuery)
        res.json({ status: true, data: result[0], totalCount: result[1] })
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get question 
module.exports.getQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var queid = isset(req.body.queid) ? req.body.queid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!queid) res.json({ status: false, message: 'Question id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var queQuery = "SELECT que.que_id, que.que_description, que.que_optionA, que.que_optionB, que.que_optionC, que.que_optionD, que.que_optionE, que.que_answer, que.que_remark, sub.sub_id, sub.sub_name FROM tbl_question AS que JOIN tbl_subject AS sub ON sub.sub_id = que.que_subid WHERE que.que_id = " + queid;
        var tagQuery = "SELECT tag.tag_name,con.con_tagid FROM tbl_tag_connection AS con JOIN tbl_tag AS tag ON tag.tag_id = con.con_tagid WHERE con_queid = " + queid;
        var result = await processQuery(queQuery + ";" + tagQuery)
        if (result[0] != '') {
          queResult = result[0];
          tagResult = result[1];
          queResult[0]['tagResult'] = tagResult;
          res.json({ status: true, data: queResult })
        } 
        else res.json({ status: false, message: 'Question does not exists.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get question 
module.exports.getCategorySubject = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var catid = isset(req.body.catid) ? req.body.catid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    if (!catid) res.json({ status: false, message: 'Category id required.' });
    else {
      var tokenResult = verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT cat.*,mm.sm_id as smid,sub.sub_id,sub.sub_name,cm.cm_id,cm.cm_name FROM tbl_course_category AS cat JOIN tbl_subject_mm AS mm ON mm.sm_catid = cat.cat_id JOIN tbl_subject AS sub ON sub.sub_id = mm.sm_subid JOIN tbl_course_master AS cm ON cm.cm_id = cat.cat_cmid WHERE cat.cat_id = " + catid;
        var sql2 = "SELECT cat.cat_id,cm.cm_id,cm.cm_name FROM tbl_course_category AS cat JOIN tbl_course_master AS cm ON cm.cm_id = cat.cat_cmid WHERE cat.cat_id = " + catid;
        var result = await processQuery(sql1 + ';' + sql2)
        res.json({ status: true, categoryData: result[0], courseData: result[1] });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--delete question 
module.exports.deleteQuestion = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var queid = isset(req.body.queid) ? req.body.queid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!queid) res.json({ status: false, message: 'Question id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT tqm_id FROM tbl_test_ques_mm WHERE tqm_queid = " + queid;
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'You can not delete question, because used in test paper.' });
        else {
          var sql2 = "DELETE FROM tbl_tag_connection WHERE con_queid = " + queid;
          var result2 = await processQuery(sql2)
          var sql3 = "DELETE FROM tbl_question WHERE que_id = " + queid;
          var result3 = await processQuery(sql3)
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

//--delete course 
module.exports.deleteCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var crsid = isset(req.body.crsid) ? req.body.crsid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!crsid) res.json({ status: false, message: 'Course id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var query = "SELECT * FROM tbl_course_institute_mm AS crs JOIN tbl_course_master AS mst ON mst.cm_id = crs.crs_cmid WHERE crs.crs_id = '" + crsid + "' AND mst.cm_status = '0'";
        var queryResult = await processQuery(query)
        if (queryResult.length > 0) {
          var sql = "DELETE FROM tbl_course_institute_mm WHERE crs_id = '" + crsid + "'";
          var result = await processQuery(sql)
          res.json({ status: true, message: 'Course deleted successfully.' });
        } 
        else {
          var sql1 = "SELECT * FROM tbl_course_institute_mm AS crs JOIN tbl_course_category AS cat ON cat.cat_cmid = crs.crs_cmid JOIN tbl_subject_mm AS mm ON mm.sm_catid = cat.cat_id WHERE crs_id = '" + crsid + "' AND crs_insid = '" + insid + "'";
          var result1 = await processQuery(sql1)
          if (result1 != '') res.json({ status: false, message: 'You can not delete course, because used in subjects.' });
          else {
            var sql2 = "SELECT * FROM tbl_course_institute_mm WHERE crs_id = '" + crsid + "' AND crs_insid = '" + insid + "'";
            var result2 = await processQuery(sql2)
            var sql3 = "DELETE FROM tbl_course_category WHERE cat_cmid = " + result2[0].crs_cmid;
            var result3 = await processQuery(sql3)
            var sql4 = "DELETE FROM tbl_course_institute_mm WHERE crs_id = " + crsid;
            var result4 = await processQuery(sql4)
            var sql5 = "DELETE FROM tbl_course_master WHERE cm_id = " + result2[0].crs_cmid;
            var result5 = await processQuery(sql5)
            res.json({ status: true, message: 'Course deleted successfully.' });
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

//-- Delete Subject From Course
module.exports.deleteSubjectFromCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var smid = isset(req.body.smid) ? req.body.smid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!smid) res.json({ status: false, message: 'Subject mapped id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT * FROM tbl_subject_mm AS mm JOIN tbl_test_subject_mm AS tsmm ON tsmm.tsmm_smid = mm.sm_id WHERE sm_id = " + smid;
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'You can not delete subject from course, because it is already used in test.' });
        else {
          var sql2 = "DELETE FROM tbl_subject_mm WHERE sm_id = '" + smid + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Subject deleted from course successfully.' });
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- Delete Subject add by institute
module.exports.deleteSubject = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var subid = isset(req.body.subid) ? req.body.subid : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!subid) res.json({ status: false, message: 'Subject id required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT * FROM tbl_subject_mm WHERE sm_subid = " + subid;
        var result1 = await processQuery(sql1)
        if (result1 != '') res.json({ status: false, message: 'You can not delete this subject, because it is mapped with course.' });
        else {
          var sql2 = "DELETE FROM tbl_subject WHERE sub_id = '" + subid + "' AND sub_insid = '" + insid + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Subject deleted successfully.'});
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- Edit Course
module.exports.editCourse = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var cmid = isset(req.body.cmid) ? req.body.cmid : "";
    var crsname = isset(req.body.crsname) ? req.body.crsname : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!cmid) res.json({ status: false, message: 'Course mapped id required.' });
    else if (!crsname) res.json({ status: false, message: 'Course name required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT cm_id FROM tbl_course_master WHERE cm_id = '" + cmid + "' AND cm_status = '1'";
        var result1 = await processQuery(sql1)
        if (result1 != '') {
          var sql2 = "UPDATE tbl_course_master SET cm_name = '" + crsname + "' WHERE cm_id = '" + cmid + "'";
          var result2 = await processQuery(sql2)
          res.json({ status: true, message: 'Course edit successfully.' });
        } 
        else res.json({ status: false, message: 'You can not edit this course name.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--method for check course aready add or not
var checkCourseExist = (insid, cmid)=>{
  return new Promise(async(resolve, reject) => {
    try{
      var sql = "SELECT * FROM tbl_course_institute_mm WHERE crs_cmid = '" + cmid + "' AND  crs_insid = '" + insid + "'";
      var result = await processQuery(sql)
      if (result != '') resolve(true);
      else {
        var sql = "INSERT INTO tbl_course_institute_mm (crs_cmid, crs_insid) VALUES ('" + cmid + "', '" + insid + "');";
        var crsResult = await processQuery(sql)
        resolve(true);
      }
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })
}

//--method for verify token
var verifyToken = function(token) {
  return new Promise(async(resolve, reject) => {
    try{
      var hash = encode.decode(token, 'base64')
      var hashArray = hash.split(":");
      var md5Hash = md5('testwave:' + hashArray[1] + ':&S9#:@plite:2017');
      var sql = "SELECT * FROM tbl_user WHERE usr_id = '" + hashArray[1] + "' AND usr_token = '" + token + "'";
      var result = await processQuery(sql)
      if (result.length == 1 && md5Hash == hashArray[2]) resolve(true);
      else resolve(false);
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })
}
