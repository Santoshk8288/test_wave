var moment = require('moment');
var con = require('./db');
var isset = require('isset');
var encode = require('nodejs-base64-encode');
var md5 = require('md5');
var formidable = require('formidable')
var fs = require('fs')
var nodemailer = require('nodemailer');

//--for staging
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'phpproject99939@gmail.com',
    pass: 'php99939'
  }
});

//--for live
/*var transporter = nodemailer.createTransport({
  host: '13.127.40.178',
  port: 25
})*/

processQuery = (query)=>{
  return new Promise((resolve, reject) => {
    con.query(query,(error, result)=>{
      if (error) reject(error);
      else resolve(result);
    })
  })
} 


//--user login 
module.exports.login = async(req, res)=>{
  try{
    var username = isset(req.body.username) ? req.body.username : "";
    var password = isset(req.body.password) ? req.body.password : "";
    if (!username) res.json({ status: false, message: 'Username required.' });
    else if (!password) res.json({ status: false, message: 'Password required.' })
    else {
      var sql1 = "SELECT usr_id,usr_type FROM tbl_user WHERE usr_username = '" + username + "' AND usr_password = '" + md5(password) + "'";
      var result = await processQuery(sql1)
      if (result.length == 1) {
        var sql2 = "SELECT usr_id,usr_type FROM tbl_user WHERE usr_username = '" + username + "' AND usr_password = '" + md5(password) + "' AND usr_isactive = '1'";
        var userResult = await processQuery(sql2)
        if (userResult.length == 1) {
          var usrid = userResult[0].usr_id;
          var md5Hash = md5('testwave:' + usrid + ':&S9#:@plite:2017');
          var hash = 'testwave:' + usrid + ':' + md5Hash;
          var token = encode.encode(hash, 'base64');
          var sql3 = "UPDATE `tbl_user` SET `usr_token` = '" + token + "' WHERE `tbl_user`.`usr_id` = " + usrid;
          var result = await processQuery(sql3)
          if (result){
            var result = await getUserDetail(usrid, userResult[0].usr_type)
            res.json({ status: true, data: result });
          } 
          else res.json({ status: false, message: 'Token does not create.' });
        } 
        else res.json({ status: false, message: 'You are not an active user, Please contact to your Institute.' });
      } 
      else res.json({ status: false, message: 'Username or password does not exists.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--user logout
module.exports.logout = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var usrid = isset(req.body.usrid) ? req.body.usrid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!usrid) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = verifyToken(token) 
      if (tokenResult) {
        var sql = "UPDATE tbl_user SET usr_token = '' WHERE usr_id = " + usrid;
        con.query(sql, function(err, result) {
          if (err) res.json({ status: false, message: 'Something went wrong.' });
          else res.json({ status: true, message: 'Logout successfully.' });
        });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

// Institute Registration
module.exports.addInstitute = (req, res)=> {
  var form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
    //--get Params 
    var username = isset(fields.username) ? fields.username : "";
    var password = isset(fields.password) ? fields.password : "";
    var name = isset(fields.name) ? fields.name : "";
    var email = isset(fields.email) ? fields.email : "";
    var contact = isset(fields.contact) ? fields.contact : "";
    var web = isset(fields.web) ? fields.web : "";
    var address = isset(fields.address) ? fields.address : "";
    var city = isset(fields.city) ? fields.city : "";
    var state = isset(fields.state) ? fields.state : "";
    var country = isset(fields.country) ? fields.country : "";
    var zipcode = isset(fields.zipcode) ? fields.zipcode : "";
    var registration = isset(fields.registration) ? fields.registration : "";
    var logo = '';

    //--check required params
    if (!username) res.json({ status: false, message: 'Username required.' });
    else if (!password) res.json({ status: false, message: 'Password required.' });
    else if (!name) res.json({ status: false, message: 'Name required.' });
    else if (!email) res.json({ status: false, message: 'Email required.' });
    else {
      var query1 = "SELECT usr_id FROM tbl_user WHERE usr_username = '" + username + "'";
      var query2 = "SELECT ins_id FROM tbl_institute WHERE ins_email = '" + email + "'";
      var queryResult = await processQuery(query1 + ';' + query2)
      if (queryResult[0].length > 0) {
        res.json({ status: false, message: 'Username already exists.' });
        return
      } 
      else if (queryResult[1].length > 0) {
        res.json({ status: false, message: 'Email already exists.' });
        return
      } 
      else {
        if (isset(files.myfile)) {
          imageUpload(files, res, function(logo) {
            if(logo){
              innerAddInstitute(fields, logo, res, function(result){
                console.log(result)
              });
            } 
            else {
              res.json({ status: false, message: 'Error in file uploading, Please try again.' });
              return
            }
          });
        } 
        else {
          innerAddInstitute(fields, logo, res, function(result) {
            console.log(result)
          });
        }
      }
    }
  })
}

// Get Institute details
module.exports.getInstituteDetail = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "SELECT *,CASE WHEN ins_logo!='' THEN CONCAT('uploads/profile/',ins_logo) ELSE ins_logo END as logo FROM tbl_institute WHERE ins_id = '" + insid + "' ";
        var instResult = await processQuery(sql)
        if (instResult.length == 1) res.json({ status: true, data: instResult });
        else res.json({ status: false, message: 'Institute not found.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

// Update Institute
module.exports.updateInstitute = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    //--get Params
    var token = isset(fields.token) ? fields.token : "";
    var insid = isset(fields.insid) ? fields.insid : "";
    var name = isset(fields.name) ? fields.name : "";
    var email = isset(fields.email) ? fields.email : "";
    var contact = isset(fields.contact) ? fields.contact : "";
    var web = isset(fields.web) ? fields.web : "";
    var address = isset(fields.address) ? fields.address : "";
    var city = isset(fields.city) ? fields.city : "";
    var state = isset(fields.state) ? fields.state : "";
    var country = isset(fields.country) ? fields.country : "";
    var zipcode = isset(fields.zipcode) ? fields.zipcode : "";
    var registration = isset(fields.registration) ? fields.registration : "";
    var logo = '';

    //--check required params
    if (!token)
      res.json({ status: false, message: 'Token required.' });
    else if (!insid)
      res.json({ status: false, message: 'Institute id required.' });
    else if (!name)
      res.json({ status: false, message: 'Name required.' });
    else if (!email)
      res.json({ status: false, message: 'Email required.' });
    else {
      verifyToken(token, function(tokenResult) {
        if (tokenResult) {
          var query = "SELECT ins_id FROM tbl_institute WHERE ins_email = '" + email + "' AND ins_id != '" + insid + "'";
          con.query(query, function(err, queryResult) {
            if (queryResult.length > 0) {
              res.json({ status: false, message: 'Email already exists.' });
              return
            } else {
              //--call function for image upload
              if (isset(files.myfile)) {
                imageUpload(files, res, function(logo) {
                  if (logo) {
                    innerUpdateInstitute(fields, logo, res, function(result) {
                      console.log(result)
                    });
                  } else {
                    res.json({ status: false, message: 'Error in file uploading, Please try again.' });
                    return
                  }
                });
              } else {
                innerUpdateInstitute(fields, logo, res, function(result) {
                  console.log(result)
                });
              }
            }
          });
        } else {
          res.json({ status: false, message: 'Token expired.' });
        }
      });
    }
  })
}

//-- Student Registration
module.exports.addStudent = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, async(err, fields, files) => {
    //--get Params
    var token = isset(fields.token) ? fields.token : "";
    var username = isset(fields.username) ? fields.username : "";
    var password = isset(fields.password) ? fields.password : "";
    var insid = isset(fields.insid) ? fields.insid : "";
    var fname = isset(fields.fname) ? fields.fname : "";
    var lname = isset(fields.lname) ? fields.lname : "";
    var fathername = isset(fields.fathername) ? fields.fathername : "";
    var email = isset(fields.email) ? fields.email : "";
    var contact1 = isset(fields.contact1) ? fields.contact1 : "";
    var contact2 = isset(fields.contact2) ? fields.contact2 : "";
    var dob = isset(fields.dob) ? fields.dob : "";
    var qualification = isset(fields.qualification) ? fields.qualification : "";
    var address = isset(fields.address) ? fields.address : "";
    var city = isset(fields.city) ? fields.city : "";
    var state = isset(fields.state) ? fields.state : "";
    var country = isset(fields.country) ? fields.country : "";
    var zipcode = isset(fields.zipcode) ? fields.zipcode : "";
    var profilePic = '';
    var type = isset(fields.type) ? fields.type : "";
    var crsid = isset(fields.crsid) ? fields.crsid : [];
    

    //--check required params
    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!username) res.json({ status: false, message: 'Username required.' });
    else if (!password) res.json({ status: false, message: 'Password required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!fname) res.json({ status: false, message: 'First name required.' });
    else if (!email) res.json({ status: false, message: 'Email required.' });
    else if (!contact1) res.json({ status: false, message: 'Contact number required.' });
    else if (!type) res.json({ status: false, message: 'Type of registration required.' });
    else if (crsid == '') res.json({ status: false, message: 'Course required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var query1 = "SELECT usr_id FROM tbl_user WHERE usr_username = '" + username + "'";
        var query2 = "SELECT stu_id FROM tbl_student WHERE stu_email = '" + email + "' AND stu_insid = '" + insid + "'";
        var queryResult = await processQuery(query1 + ';' + query2)
        if (queryResult[0].length > 0) {
          res.json({ status: false, message: 'Username already exists.' });
          return
        } 
        else if (queryResult[1].length > 0) {
          res.json({ status: false, message: 'Email already exists.' });
          return
        } 
        else {
          //--used for upload image first then update
          if (isset(files.myfile)) {
            imageUpload(files, res, function(profilePic) {
              if (profilePic) {
                innerAddStudent(fields, profilePic, res, function(result) {
                  console.log(result)
                });
              } else {
                res.json({ status: false, message: 'Error in file uploading, Please try again.' });
                return
              }
            });
          } 
          else {
            innerAddStudent(fields, profilePic, res, function(result) {
              console.log(result)
            });
          }
        }
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  })
}

//-- Update Student
module.exports.updateStudent = function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    //--get Params
    var token = isset(fields.token) ? fields.token : "";
    var stuid = isset(fields.stuid) ? fields.stuid : "";
    var fname = isset(fields.fname) ? fields.fname : "";
    var lname = isset(fields.lname) ? fields.lname : "";
    var fathername = isset(fields.fathername) ? fields.fathername : "";
    var email = isset(fields.email) ? fields.email : "";
    var contact1 = isset(fields.contact1) ? fields.contact1 : "";
    var contact2 = isset(fields.contact2) ? fields.contact2 : "";
    var dob = isset(fields.dob) ? fields.dob : "";
    var qualification = isset(fields.qualification) ? fields.qualification : "";
    var address = isset(fields.address) ? fields.address : "";
    var city = isset(fields.city) ? fields.city : "";
    var state = isset(fields.state) ? fields.state : "";
    var country = isset(fields.country) ? fields.country : "";
    var zipcode = isset(fields.zipcode) ? fields.zipcode : "";
    var profilePic = '';
    var type = isset(fields.type) ? fields.type : "";
    var crsid = isset(fields.crsid) ? fields.crsid : [];
    var password = isset(fields.password) ? fields.password : "";
    var insid = isset(fields.insid) ? fields.insid : "";
    

    //--check required params
    if (!token)
      res.json({ status: false, message: 'Token required.' });
    else if (!stuid)
      res.json({ status: false, message: 'Student id required.' });
    else if (!fname)
      res.json({ status: false, message: 'First name required.' });
    else if (!email)
      res.json({ status: false, message: 'Email required.' });
    else if (!contact1)
      res.json({ status: false, message: 'Contact number required.' });
    else if (!type)
      res.json({ status: false, message: 'Type of registration required.' });
    else if (!crsid)
      res.json({ status: false, message: 'Course required.' });
    else if (!insid)
      res.json({ status: false, message: 'Institute id required.' });
    else {
      verifyToken(token, function(tokenResult) {
        if (tokenResult) {
          var query = "SELECT stu_id FROM tbl_student WHERE stu_email = '" + email + "' AND stu_insid = '" + insid + "' AND stu_id != '" + stuid + "'";
          con.query(query, function(err, queryResult) {
            if (queryResult.length > 0) {
              res.json({ status: false, message: 'Email already exists.' });
              return
            } else {
              //--used for upload image first then update
              if (isset(files.myfile)) {
                imageUpload(files, res, function(profilePic) {
                  if (profilePic) {
                    innerUpdateStudent(fields, profilePic, res, function(result) {
                      console.log(result)
                    });
                  } else {
                    res.json({ status: false, message: 'Error in file uploading, Please try again.' });
                    return
                  }
                });
              } else {
                innerUpdateStudent(fields, profilePic, res, function(result) {
                  console.log(result)
                });
              }
            }
          });
        } else {
          res.json({ status: false, message: 'Token expired.' });
        }
      });
    }
  })
}

//--get institute student list 
module.exports.getStudentList = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";
    var start = isset(req.body.start) ? req.body.start : "";
    var end = isset(req.body.end) ? req.body.end : "";
    var name = isset(req.body.name) ? req.body.name : "";
    var type = isset(req.body.type) ? req.body.type : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else if (!type) res.json({ status: false, message: 'Type id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        if (type == '0') {
          var sql = "SELECT SQL_CALC_FOUND_ROWS stu.stu_id,stu.stu_fname,stu.stu_lname,stu.stu_email,CASE WHEN stu.stu_profilepic!='' THEN CONCAT('uploads/profile/',stu.stu_profilepic) ELSE stu.stu_profilepic END as profilePic,usr.usr_id,usr.usr_username,usr_isactive FROM tbl_student AS stu JOIN tbl_user AS usr ON usr.usr_id = stu.stu_usrid JOIN tbl_student_course_mm AS scmm ON scmm.scmm_stuid = stu.stu_id WHERE stu_insid = '" + insid + "' AND scmm.scmm_type = '0' AND stu_fname LIKE '" + name + "%' GROUP BY stu.stu_id ORDER BY stu_updatedate desc";
        } else if (type == '1') {
          var sql = "SELECT SQL_CALC_FOUND_ROWS stu.stu_id,stu.stu_fname,stu.stu_lname,stu.stu_email,CASE WHEN stu.stu_profilepic!='' THEN CONCAT('uploads/profile/',stu.stu_profilepic) ELSE stu.stu_profilepic END as profilePic,usr.usr_id,usr.usr_username,usr_isactive FROM tbl_student AS stu JOIN tbl_user AS usr ON usr.usr_id = stu.stu_usrid JOIN tbl_student_course_mm AS scmm ON scmm.scmm_stuid = stu.stu_id WHERE stu_insid = '" + insid + "' AND scmm.scmm_type = '1' AND stu_fname LIKE '" + name + "%' GROUP BY stu.stu_id ORDER BY stu_updatedate desc";
        }
        if (type == '2') {
          var sql = "SELECT SQL_CALC_FOUND_ROWS gst.gst_id,gst.gst_name,gst.gst_email,cou.cou_code FROM tbl_coupon AS cou JOIN tbl_series AS ser ON ser.ser_id = cou.cou_serid JOIN tbl_guest_user AS gst ON gst.gst_coupon = cou.cou_code WHERE ser.ser_insid = '" + insid + "' AND gst.gst_name LIKE '" + name + "%' ORDER BY gst.gst_createdate desc";
        }

        if (start || end)
          sql = sql + " LIMIT " + start + " , " + end;

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

//--get student detail 
module.exports.getStudentDetail = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var response = [];
      if (tokenResult) {
        var sql1 = "SELECT usr.usr_id,usr.usr_username,stu.*,CASE WHEN stu_profilepic!='' THEN CONCAT('uploads/profile/',stu_profilepic) ELSE stu_profilepic END as profilePic, scmm.scmm_type FROM tbl_student AS stu JOIN tbl_user AS usr ON usr.usr_id = stu.stu_usrid JOIN tbl_student_course_mm AS scmm ON scmm.scmm_stuid = stu.stu_id WHERE stu.stu_id = '" + stuid + "' GROUP BY stu.stu_id";

        var sql2 = "SELECT scmm_id,scmm_crsid as crs_id FROM tbl_student_course_mm WHERE scmm_stuid = " + stuid;
        var result = await processQuery(sql1 + ";" + sql2)
        if (result[0] != '') {
          response = result[0]
          response[0]['course'] = result[1]
          res.json({ status: true, data: response });
        } 
        else res.json({ status: false, message: 'Student not found.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Do active and deactive student
module.exports.activeOrDeactiveStudent = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var usrid = isset(req.body.usrid) ? req.body.usrid : "";
    var isactive = isset(req.body.isactive) ? req.body.isactive : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!usrid) res.json({ status: false, message: 'Student id required.' });
    else if (!isactive) res.json({ status: false, message: 'Status required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql = "UPDATE tbl_user SET usr_isactive = '" + isactive + "' WHERE usr_id = " + usrid;
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Status changed successfully.' });
      }
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

// Change Password
module.exports.changePassword = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var usrid = isset(req.body.usrid) ? req.body.usrid : "";
    var oldPass = isset(req.body.oldPass) ? md5(req.body.oldPass) : "";
    var newPass = isset(req.body.newPass) ? md5(req.body.newPass) : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!usrid) res.json({ status: false, message: 'User id required.' });
    else if (!oldPass) res.json({ status: false, message: 'Old password required.' });
    else if (!newPass) res.json({ status: false, message: 'New password required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var sql1 = "SELECT usr_id FROM tbl_user WHERE usr_id = ? AND usr_password = ?";
        var userResult = await processQuery(sql1, [usrid, oldPass])
        if (userResult.length == 1) {
          var sql2 = "UPDATE tbl_user SET usr_password = '" + newPass + "', usr_updatedate = '" + moment.utc().unix() + "' WHERE usr_id = '" + usrid + "'";
          var result = await processQuery(sql2)
          res.json({ status: true, message: 'Password changed successfully.' });
        } 
        else res.json({ status: false, message: 'Old password does not match.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//Forgot Password
module.exports.forgotPassword = async(req, res)=>{
  try{
    var username = isset(req.body.username) ? req.body.username : "";

    if (!username) res.json({ status: false, message: 'Username required.' });
    else {
      sql1 = "SELECT usr_id,usr_type FROM tbl_user WHERE usr_username = '" + username + "'";
      var userResult = await processQuery(sql1)
      if (userResult.length > 0) {
        if (userResult[0].usr_type == '1') sql2 = "SELECT ins_name as name, ins_email as email FROM tbl_institute WHERE ins_usrid = '" + userResult[0].usr_id + "'";

        if (userResult[0].usr_type == '2') sql2 = "SELECT stu_fname as name, stu_email as email FROM tbl_student WHERE stu_usrid = '" + userResult[0].usr_id + "'";

        var result = await processQuery(sql2)
        if (result.length > 0) {
          var host = '';
          if (req.headers.host == 'www.testwave.in:3210') host = "www.testwave.in";
          else host = "192.168.88.2:8434/testwave";

          var id = encode.encode('testwave:1' + userResult[0].usr_id + '1:@plite', 'base64');
          var mailOptions = {
            from: 'phpproject99939@gmail.com',
            to: result[0].email,
            subject: 'Reset password...',
            html: "Hi " + result[0].name + ", <br/><br/>" +
              "This mail is from <b>TestWave</b> for Reset your account password <br/>" +
              "click on the below link to continue the reset password process.<br/>" +
              "<b>link : http://" + host + "/#/passwordReset?id=" + id + " </b><br/><br/>" +
              "<div>Regards, <br/> TestWave <br/>"
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) res.json({ status: false, message: 'Some error occured' });
            else res.json({ status: true, message: 'Reset password mail sent to your email address.' });
          });
        } 
        else res.json({ status: false, message: 'Something went wrong.' });
      } 
      else res.json({ status: false, message: 'Username does not exists.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//Reset Password
module.exports.resetPassword = async(req, res)=>{
  try{
    var id = isset(req.body.id) ? req.body.id : "";
    var password = isset(req.body.password) ? req.body.password : "";

    if (!id) res.json({ status: false, message: 'Id required.' });
    if (!password) res.json({ status: false, message: 'Password required.' });
    else {
      var hash = encode.decode(id, 'base64')
      var hashArray = hash.split(":");
      var usrid = hashArray[1].slice(1, -1);
      sql = "UPDATE tbl_user SET usr_password = '" + md5(password) + "', usr_updatedate = '" + moment.utc().unix() + "' WHERE usr_id = '" + usrid + "' ";
      var userResult = await processQuery(sql)
      if (userResult) res.json({ status: true, message: 'Password changed successfully.' });
      else res.json({ status: false, message: 'Error in changing password, Please try again.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

// Check Username is already exist or not
module.exports.isUsernameAvl = async(req, res)=>{
  try{
    var username = typeof req.body.username == "undefined" ? "" : req.body.username;

    if (!username) res.json({ status: false, message: "Enter username." });
    else {
      var sql = "SELECT usr_id FROM tbl_user where usr_username = ?";
      var userResult = await processQuery(sql) 
      if (usrResult.length > 0) res.json({ status: false, message: "This username already exists." });
      else res.json({ status: true, message: "This username available." });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get total counts
module.exports.getAdminDashboardCounts = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var response = [];
        var sql1 = "SELECT COUNT(stu_id) AS studentCount FROM tbl_student WHERE stu_insid = '" + insid + "'";
        var sql2 = "SELECT COUNT(crs_id) AS courseCount FROM tbl_course_institute_mm WHERE crs_insid = '" + insid + "'";
        var sql3 = "SELECT COUNT(test_id) AS speedTestCount FROM tbl_test WHERE test_insid = '" + insid + "' AND test_type = '1'";
        var sql4 = "SELECT COUNT(test_id) AS PracticeTestCount FROM tbl_test WHERE test_insid = '" + insid + "' AND test_type = '0'";
        var sql5 = "SELECT COUNT(ser_id) AS seriesCount FROM tbl_series WHERE ser_insid = '" + insid + "'";
        var result = await processQuery(sql1 + ";" + sql2 + ";" + sql3 + ";" + sql4 + ";" + sql5)
        response.push(result[0][0])
        response.push(result[1][0])
        response.push(result[2][0])
        response.push(result[3][0])
        response.push(result[4][0])
        res.json({ status: true, data: response });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get total counts
module.exports.getStudentDashboardCounts = async(req, res)=>{
  try{  
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";
    var type = isset(req.body.type) ? req.body.type : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!stuid) res.json({ status: false, message: 'Student id required.' });
    else if (!type) res.json({ status: false, message: 'Type of registration required.' });
    else {
      var tokenResult = await verifyToken(token)
      if (tokenResult) {
        var response = [];
        var sql1 = "SELECT COUNT(res_id) AS testAttempt FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res_stuid = '" + stuid + "' AND test.test_type = '1' AND res.res_status = '1'";
        var sql2 = "SELECT AVG((res.res_marks_abtain * 100) / test.test_max_marks) AS averageScore FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res_stuid = '" + stuid + "' AND test.test_type = '1'";
        var sql3 = "SELECT SUM(test.test_min_marks <= res.res_marks_abtain) AS passTest FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res_stuid = '" + stuid + "' AND test.test_type = '1'";

        if (type == '1') var sql4 = "SELECT COUNT(*) AS totalTest FROM tbl_student AS stu JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id JOIN tbl_test_series_mm AS tsm ON tsm.tsm_serid = smm.scmm_crsid JOIN tbl_test AS test ON test.test_id = tsm.tsm_testid WHERE stu_id = '" + stuid + "' AND test_type = '1' AND scmm_type = '1'";
        else var sql4 = "SELECT COUNT(*) AS totalTest FROM tbl_student AS stu JOIN tbl_student_course_mm AS smm ON smm.scmm_stuid = stu.stu_id JOIN tbl_test_course_mm AS tcm ON tcm.tcm_crsid = smm.scmm_crsid JOIN tbl_test AS test ON test.test_id = tcm.tcm_testid WHERE stu_id = '" + stuid + "' AND test_type = '1' AND scmm_type = '0'";
        var result = await processQuery(sql1 + ";" + sql2 + ";" + sql3 + ";" + sql4)
        response.push(result[0][0]);
        response.push(result[1][0]);
        response.push(result[2][0]);
        response.push(result[3][0]);
        res.json({ status: true, data: response });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--get Upcoming Test 7 days tests for admin dashbord
module.exports.getUpcomingTestData = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var response = [];
      var testCount = [];
      var date = [];
      if (tokenResult) {
        var j = 0;
        for (var i = 0; i < 7; i++) {
          var currentDate = parseInt(new Date(moment(Date.now() + i * 24 * 3600 * 1000).format('YYYY-MM-DD 00:00:00')).getTime() / 1000);
          var endDate = parseInt(new Date(moment(Date.now() + i * 24 * 3600 * 1000).format('YYYY-MM-DD 23:59:59')).getTime() / 1000);
          var sql = "SELECT COUNT(test_id) testCount FROM tbl_test WHERE test_insid = '" + insid + "' AND test_type = '1' AND test_opendate >= '" + currentDate + "' AND test_opendate <= '" + endDate + "'";
          date.push(currentDate)
          var result = await processQuery(sql)
          j++;
          testCount.push(result[0].testCount)
          if (j == 7) {
            response.push(date)
            response.push({ testCount: testCount })
            res.json({ status: true, data: response });
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

//--get last Year Student Data for admin dashbord month wise
module.exports.lastYearStudentData = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var insid = isset(req.body.insid) ? req.body.insid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!insid) res.json({ status: false, message: 'Institute id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var response = [];
      var studentCount = [];
      var month = [];
      if (tokenResult) {
        var j = 0;
        date1 = new Date();
        date1.setMonth(new Date().getMonth() - 12);

        for (var i = 0; i < 12; i++) {
          date1.setMonth(date1.getMonth() + 1);
          date1.setDate(01);
          var currentDate = parseInt(new Date(moment(date1).format('MM-DD-YYYY 00:00:00')).getTime() / 1000);
          //console.log(new Date(moment(date1).format('MM-DD-YYYY 00:00:00')));

          lastDate = parseInt(moment(date1).endOf('month').format('DD'));
          lDate = new Date(date1);
          lDate.setDate(lastDate);
          var endDate = parseInt(new Date(moment(lDate).format('MM-DD-YYYY 23:59:59')).getTime() / 1000);
          //console.log(new Date(moment(lDate).format('MM-DD-YYYY 23:59:59')));
          month.push(moment(lDate).format('MMM'))

          var sql = "SELECT COUNT(stu_id) studentCount FROM tbl_student WHERE stu_insid = '" + insid + "' AND stu_createdate >= '" + currentDate + "' AND stu_createdate <= '" + endDate + "'";
          var result = await processQuery(sql)
          j++;
          studentCount.push(result[0].studentCount)
          if (j == 12) {
            response.push({ month: month })
            response.push({ studentCount: studentCount })
            res.json({ status: true, data: response });
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

//--get last year average test score Data for student dashbord
module.exports.getStudentTestData = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!(stuid)) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var response = [];
      var month = [];
      var avgScore = [];
      if (tokenResult) {
        var j = 0;
        date1 = new Date();
        date1.setMonth(new Date().getMonth() - 12);

        for (var i = 0; i < 12; i++) {
          date1.setMonth(date1.getMonth() + 1);
          date1.setDate(01);
          var currentDate = parseInt(new Date(moment(date1).format('MM-DD-YYYY 00:00:00')).getTime() / 1000);
          //console.log(new Date(moment(date1).format('MM-DD-YYYY 00:00:00')));

          lastDate = parseInt(moment(date1).endOf('month').format('DD'));
          lDate = new Date(date1);
          lDate.setDate(lastDate);
          var endDate = parseInt(new Date(moment(lDate).format('MM-DD-YYYY 23:59:59')).getTime() / 1000);
          //console.log(new Date(moment(lDate).format('MM-DD-YYYY 23:59:59')));
          month.push(moment(lDate).format('MMM'))

          var sql = "SELECT round(AVG(res.res_marks_abtain),2) as avgScore FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res.res_stuid = '" + stuid + "' AND res.res_status = '1' AND res.res_updatedate >= '" + currentDate + "' AND res.res_updatedate <= '" + endDate + "' AND test.test_type = '1'";
          var result = await processQuery(sql)
          j++;
          if (result[0].avgScore == null) result[0].avgScore = 0
          avgScore.push(result[0].avgScore)
          if (j == 12) {
            response.push({ month: month })
            response.push({ avgScore: avgScore })
            res.json({ status: true, data: response });
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

//--get last 7 speed Tests Data for student dashbord
module.exports.getStudentSevenTestData = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var stuid = isset(req.body.stuid) ? req.body.stuid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!(stuid)) res.json({ status: false, message: 'Student id required.' });
    else {
      var tokenResult = await verifyToken(token)
      var response = [];
      var testName = [];
      var score = [];
      if (tokenResult) {
        var sql = "SELECT test.test_name, res.res_marks_abtain FROM tbl_result AS res JOIN tbl_test AS test ON test.test_id = res.res_testid WHERE res_stuid = '" + stuid + "' AND test.test_type = '1' AND res_status = '1' ORDER BY res_updatedate LIMIT 7";
        var result = await processQuery(sql)
        if (result != '') {
          var i = 0;
          result.forEach(function(value) {
            i++;
            testName.push(value.test_name)
            score.push(value.res_marks_abtain)
            if (result.length == i) {
              response.push({ testName: testName })
              response.push({ score: score })
              res.json({ status: true, data: response });
            }
          })
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

//--Verify Guest Coupon
module.exports.verifyGuestCoupon = async(req, res)=>{
  try{
    var coupon = isset(req.body.coupon) ? req.body.coupon : "";

    if (!coupon) res.json({ status: false, message: 'Coupon code required.' });
    else {
      var sql1 = "SELECT * FROM tbl_coupon WHERE cou_code = '" + coupon + "'";
      var result1 = await processQuery(sql1)
      if (result1 != '') {
        var sql2 = "SELECT gst_id,gst_name,gst_email FROM tbl_guest_user WHERE gst_coupon = '" + coupon + "'";
        var result2 = await processQuery(sql2)
        if (result2 != '') res.json({ status: true, data: result2, message: 'You have already register, Please login.' });
        else res.json({ status: true, data: result2, message: 'Please register first.' });
      } 
      else res.json({ status: false, message: 'Invalid coupon code.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--Guest Login Or Register
module.exports.guestLoginOrRegister = async(req, res)=>{
  try{
    var name = isset(req.body.name) ? req.body.name : "";
    var email = isset(req.body.email) ? req.body.email : "";
    var coupon = isset(req.body.coupon) ? req.body.coupon : "";

    if (!coupon) res.json({ status: false, message: 'Coupon code required.' });
    else {
      var sql1 = "SELECT gst_id FROM tbl_guest_user WHERE gst_coupon = '" + coupon + "'";
      var result1 = await processQuery(sql1)
      if (result1 != '') {
        var gstid = result1[0].gst_id;
        var md5Hash = md5('testwave:' + gstid + ':&S9#:@plite:2017');
        var hash = 'testwave:' + gstid + ':' + md5Hash;
        var token = encode.encode(hash, 'base64');
        var sql2 = "UPDATE `tbl_guest_user` SET `gst_token` = '" + token + "' WHERE `gst_id` = " + gstid;
        var result2 = await processQuery(sql2)
        if (result2) {
          var result = getGuestUserDetail(gstid, coupon)
          result[0].usr_type = '3';
          res.json({ status: true, data: result });   
        } 
        else res.json({ status: false, message: 'Token does not create, Sorry try again.' });
      } 
      else {
        var sql1 = "INSERT INTO tbl_guest_user (gst_name, gst_email, gst_coupon, gst_token, gst_createdate) VALUES ('" + name + "', '" + email + "', '" + coupon + "', '', '" + moment.utc().unix() + "')";
        var result1 = await processQuery(sql1)
        if (result1) {
          var sql2 = "UPDATE tbl_coupon SET cou_status = '1' WHERE cou_code = '" + coupon + "'";
          var result2 = await processQuery(sql2)
          if (result2) {
            var sql3 = "SELECT gst_id FROM tbl_guest_user WHERE gst_id = '" + result1.insertId + "'";
            var result3 = await processQuery(sql3)
            if (result3 != '') {
              var gstid = result3[0].gst_id;
              var md5Hash = md5('testwave:' + gstid + ':&S9#:@plite:2017');
              var hash = 'testwave:' + gstid + ':' + md5Hash;
              var token = encode.encode(hash, 'base64');
              var sql4 = "UPDATE `tbl_guest_user` SET `gst_token` = '" + token + "' WHERE `gst_id` = " + gstid;
              var result4 = await processQuery(sql4)
              if (result4) {
                var result = getGuestUserDetail(gstid, coupon)
                result[0].usr_type = '3';
                res.json({ status: true, data: result });
              } 
              else res.json({ status: false, message: 'Token does not create, Sorry try again.' });
            } 
            else res.json({ status: false, message: 'Something went wrong.' });
          } 
          else res.json({ status: false, message: 'Something went wrong.' });
        } 
        else res.json({ status: false, message: 'Something went wrong.' });
      }
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//--guest user logout
module.exports.guestUserLogout = async(req, res)=>{
  try{
    var token = isset(req.body.token) ? req.body.token : "";
    var gstid = isset(req.body.gstid) ? req.body.gstid : "";

    if (!token) res.json({ status: false, message: 'Token required.' });
    else if (!gstid) res.json({ status: false, message: 'Guest user id required.' });
    else {
      var hash = encode.decode(token, 'base64')
      var hashArray = hash.split(":");
      var md5Hash = md5('testwave:' + hashArray[1] + ':&S9#:@plite:2017');
      var sql = "SELECT * FROM tbl_guest_user WHERE gst_id = '" + hashArray[1] + "' AND gst_token = '" + token + "'";
      var result = await processQuery(sql)
      if (result.length == 1 && md5Hash == hashArray[2]) {
        var sql = "UPDATE tbl_guest_user SET gst_token = '' WHERE gst_id = " + gstid;
        var result = await processQuery(sql)
        res.json({ status: true, message: 'Logout successfully.' });
      } 
      else res.json({ status: false, message: 'Token expired.' });
    }
  }
  catch(error){
    res.json({ status: false, message: 'Something went wrong.' });
  }
}

//-- for update student
var innerUpdateStudent = function(fields, profilePic, res, callback) {
  if (fields.password) {
    var query1 = "SELECT stu_usrid FROM tbl_student WHERE stu_id = '" + fields.stuid + "'";
    con.query(query1, function(err, queryResult) {
      if (queryResult.length == 1) {
        var query2 = "UPDATE tbl_user SET usr_password = '" + md5(fields.password) + "', usr_updatedate = '" + moment.utc().unix() + "' WHERE usr_id = '" + queryResult[0].stu_usrid + "'";
        con.query(query2, function(err, result) {
          if (err) {
            res.json({ status: false, message: 'Something went wrong.' });
            return
          }
        });
      } else {
        res.json({ status: false, message: 'Something went wrong.' });
        return
      }
    });
  }

  //--for update student data
  var sql1 = "UPDATE tbl_student SET stu_fname = '" + fields.fname + "', stu_lname = '" + fields.lname + "', stu_fathername = '" + fields.fathername + "', stu_email = '" + fields.email + "', stu_contact_no1 = '" + fields.contact1 + "', stu_contact_no2 = '" + fields.contact2 + "', stu_dob = '" + fields.dob + "', stu_qualification = '" + fields.qualification + "',";
  if (isset(profilePic)) {
    var sql1 = sql1 + "stu_profilepic = '" + profilePic + "',";
  }
  var sql1 = sql1 + "stu_address = '" + fields.address + "', stu_city = '" + fields.city + "', stu_state = '" + fields.state + "', stu_country = '" + fields.country + "', stu_zipcode = '" + fields.zipcode + "', stu_updatedate ='" + moment.utc().unix() + "' WHERE stu_id = '" + fields.stuid + "'";
  con.query(sql1, function(err, result) {
    if (result) {
      //--delete student course
      var sql2 = "DELETE FROM tbl_student_course_mm WHERE scmm_stuid = '" + fields.stuid + "'";
      con.query(sql2, function(err, result) {
        if (err) {
          res.json({ status: false, message: 'Something went wrong.' });
          return
        }
      });

      //--insert student course data
      var crsid = fields.crsid;
      crsid = JSON.parse(crsid);
      
      if (crsid != '') {
        for (var i = 0; i < crsid.length; i++) {
          var sql3 = "INSERT INTO tbl_student_course_mm (scmm_stuid, scmm_crsid, scmm_type) VALUES ('" + fields.stuid + "', '" + crsid[i].crsid + "', '" + fields.type + "')";
          con.query(sql3, function(err, crsResult) {
            if (err) {
              res.json({ status: false, message: 'Something went wrong.' });
              return
            }
          });
        }
      }
      res.json({ status: true, data: 'Student Updated successfully.' });
    } else {
      res.json({ status: false, message: 'Error in updating student, Please try again.' });
    }
  })
}

//-- for update institute
var innerUpdateInstitute = function(fields, logo, res, callback) {
  //--update institute details
  var sql = "UPDATE tbl_institute SET ins_name = '" + fields.name + "', ins_email = '" + fields.email + "', ins_contact_no = '" + fields.contact + "', ins_web = '" + fields.web + "', ins_address = '" + fields.address + "', ins_city = '" + fields.city + "', ins_state = '" + fields.state + "', ins_country = '" + fields.country + "', ins_zipcode = '" + fields.zipcode + "', ins_registration_no = '" + fields.registration + "',";
  if (isset(logo)) {
    var sql = sql + "ins_logo = '" + logo + "',";
  }
  var sql = sql + "ins_updatedate = '" + moment.utc().unix() + "' WHERE ins_id ='" + fields.insid + "'";

  con.query(sql, function(err, result) {
    if (result)
      res.json({ status: true, data: 'Institute Updated successfully.' });
    else
      res.json({ status: false, message: 'Error in updating institute, Please try again.' });
  });
}

//-- for add institute
var innerAddInstitute = function(fields, logo, res, callback) {
  //-- insert data
  var userQuery = "INSERT INTO tbl_user (usr_username, usr_password, usr_type, usr_isactive, usr_token, usr_createdate, usr_updatedate) VALUES ('" + fields.username + "', '" + md5(fields.password) + "', '1', '1', '', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
  con.query(userQuery, function(err, userResult) {
    if (err)
      res.json({ status: true, message: 'Something went wrong.' });
    else {
      if (userResult) {
        var sql = "INSERT INTO tbl_institute (ins_usrid, ins_name, ins_email, ins_contact_no, ins_web, ins_address, ins_city, ins_state, ins_country, ins_zipcode, ins_registration_no, ins_logo, ins_createdate, ins_updatedate) VALUES ('" + userResult.insertId + "', '" + fields.name + "', '" + fields.email + "', '" + fields.contact + "', '" + fields.web + "', '" + fields.address + "', '" + fields.city + "', '" + fields.state + "', '" + fields.country + "', '" + fields.zipcode + "', '" + fields.registration + "', '" + logo + "', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
        con.query(sql, function(err, result) {
          if (result) {
            //--for send success email
            var mailOptions = {
              from: 'phpproject99939@gmail.com',
              to: fields.email,
              subject: 'Registration confirmation mail...',
              html: "Hi " + fields.name + ", <br/><br/>" +
                "You are successfully register in testwave. Login details are,<br/><br/>Username : " + fields.username + "<br/> Password : " + fields.password +
                "<br/><br/><div>Regards, <br/> TestWave <br/>"
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error)
                res.json({ status: true, message: 'Institute registered successfully but email has not been sent.' });
              else
                res.json({ status: true, message: 'Institute registered successfully and login details has been sent to registered email.' });
            });
          } else
            res.json({ status: false, message: 'Error in institute registration, Please try again.' });
        });
      }
    }
  });
}

//-- for add student
var innerAddStudent = function(fields, profilePic, res, callback) {
  //-- for insert student data
  var userQuery = "INSERT INTO tbl_user (usr_username, usr_password, usr_type, usr_isactive, usr_token, usr_createdate, usr_updatedate) VALUES ('" + fields.username + "', '" + md5(fields.password) + "', '2', '1', '', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
  con.query(userQuery, function(err, userResult) {
    if (err)
      res.json({ status: true, message: 'Something went wrong.' });
    else {
      if (userResult) {
        var sql = "INSERT INTO tbl_student (stu_usrid, stu_insid, stu_fname, stu_lname, stu_fathername, stu_email, stu_contact_no1, stu_contact_no2, stu_dob, stu_qualification, stu_profilepic, stu_address, stu_city, stu_state, stu_country, stu_zipcode, stu_createdate, stu_updatedate) VALUES ('" + userResult.insertId + "', '" + fields.insid + "', '" + fields.fname + "', '" + fields.lname + "', '" + fields.fathername + "', '" + fields.email + "', '" + fields.contact1 + "', '" + fields.contact2 + "', '" + fields.dob + "', '" + fields.qualification + "', '" + profilePic + "', '" + fields.address + "', '" + fields.city + "', '" + fields.state + "', '" + fields.country + "', '" + fields.zipcode + "', '" + moment.utc().unix() + "', '" + moment.utc().unix() + "')";
        con.query(sql, function(err, result) {
          if (err) {
            var sql = "DELETE FROM tbl_user WHERE usr_username = '" + fields.username + "'"
            con.query(sql, function(err, result) {
              console.log('@@@@', err)
            })
          }
          if (result) {
            var crsid = fields.crsid;
            crsid = JSON.parse(crsid);
            

            for (var i = 0; i < crsid.length; i++) {
              var sql2 = "INSERT INTO tbl_student_course_mm (scmm_stuid, scmm_crsid, scmm_type) VALUES ('" + result.insertId + "', '" + crsid[i].crsid + "', '" + fields.type + "')";
              con.query(sql2, function(err, crsResult) {
                if (err) {
                  res.json({ status: false, message: 'Something went wrong.' });
                  return
                }
              });
            }

            //--for send sucess email
            var mailOptions = {
              from: 'phpproject99939@gmail.com',
              to: fields.email,
              subject: 'Registration confirmation mail...',
              html: "Hi " + fields.fname + ", <br/><br/>" +
                "You are successfully register in testwave. Login details are,<br/><br/>Username : " + fields.username + "<br/> Password : " + fields.password +
                "<br/><br/><div>Regards, <br/> TestWave <br/>"
            };

            transporter.sendMail(mailOptions, function(error, info) {
              if (error)
                res.json({ status: true, message: 'Student registered successfully but email has not been sent.' });
              else
                res.json({ status: true, message: 'Student registered successfully and login details have been sent to the registered email.' });
            });
          } else
            res.json({ status: false, message: 'Error in student registration, Please try again.' });
        });
      }
    }
  });
}

//--get particular user detail
var getUserDetail = (usrid, type)=>{
  return new Promise(async(resolve, reject) => {
    if (type == '1') var sql = "SELECT usr.usr_id,usr.usr_token,usr.usr_type,ins.ins_id,ins.ins_name,ins.ins_email,ins.ins_registration_no,ins.ins_logo,CASE WHEN ins_logo!='' THEN CONCAT('uploads/profile/',ins_logo) ELSE ins_logo END as logo FROM tbl_user AS usr JOIN tbl_institute AS ins ON ins.ins_usrid = usr.usr_id WHERE usr_id = " + usrid;
    else var sql = "SELECT usr.usr_id,usr.usr_token,usr.usr_type,stu.stu_id,stu.stu_insid,stu.stu_fname,stu.stu_lname,stu.stu_fathername,stu.stu_email,stu.stu_profilepic, CASE WHEN stu_profilepic!='' THEN CONCAT('uploads/profile/',stu_profilepic) ELSE stu_profilepic END as profilePic, CASE WHEN ins.ins_logo!='' THEN CONCAT('uploads/profile/',ins.ins_logo) ELSE ins.ins_logo END as logo, ins.ins_name, scmm.scmm_type FROM tbl_user AS usr JOIN tbl_student AS stu ON stu.stu_usrid = usr.usr_id JOIN tbl_institute AS ins ON ins.ins_id = stu.stu_insid JOIN tbl_student_course_mm AS scmm ON scmm.scmm_stuid = stu.stu_id WHERE usr.usr_id = '" + usrid + "' GROUP BY usr_id";
    try{
      var result = await processQuery(sql)
      resolve(result)
    }
    catch(error){
      res.json({ status: false, message: 'Something went wrong.' });
    }
  })
}

//-- for image upload
var imageUpload = (files, res, callback)=>{
  var old_path = files.myfile.path,
  file_size = files.myfile.size,
  file_ext = files.myfile.name.split('.').pop(),
  index = old_path.lastIndexOf('/') + 1,
  new_path = moment.utc().unix() + '.' + file_ext;

  fs.readFile(old_path, function(err, data) {
    fs.writeFile('./uploads/profile/' + new_path, data, function(err) {
      if (err)
        return callback(err, null);
      else
        return callback(new_path);
    });
  });
}

//--method for verify token
var verifyToken = function(token) {
  return new Promise(async(resolve, reject) => {
    var hash = encode.decode(token, 'base64')
    var hashArray = hash.split(":");
    var md5Hash = md5('testwave:' + hashArray[1] + ':&S9#:@plite:2017');
    var sql = "SELECT * FROM tbl_user WHERE usr_id = '" + hashArray[1] + "' AND usr_token = '" + token + "'";
    try{
      var result = await processQuery(sql) 
      if (result.length == 1 && md5Hash == hashArray[2]) resolve(true);
      else resolve(false);
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })  
}

//--get particular guest user detail
var getGuestUserDetail = function(gstid, coupon) {
  return new Promise(async(resolve, reject) => {
    var response = [];
    var couponArray = coupon.split("-");
    var sql1 = "SELECT gst_id,gst_name,gst_email,gst_token FROM tbl_guest_user WHERE gst_id = '" + gstid + "'";
    var sql2 = "SELECT ins_name FROM tbl_institute WHERE ins_id = '" + couponArray[1] + "'";
    try{
      var result = await processQuery(sql1 + ";" + sql2)
      result[0][0]['ins_name'] = result[1][0].ins_name;
      response.push(result[0]);
      resolve(result[0]);
    }
    catch(error){
      console.log('Something went wrong.');
    }
  })
}
