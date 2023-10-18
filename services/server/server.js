var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3210
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//--add header
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

//--add module
var User = require('./models/user');
var Course = require('./models/course');
var Test = require('./models/test');

//-- test method
app.get('/api/test', function(req, res) {
  res.write("<br/>Running successfully");
  res.end();
})

//-- call for user login
app.post('/api/login', User.login);

//-- call for logout user
app.post('/api/logout', User.logout);

//-- call for institute registration
app.post('/api/addInstitute', User.addInstitute);

//-- call for get institute
app.post('/api/getInstituteDetail', User.getInstituteDetail);

//-- call for update institute
app.post('/api/updateInstitute', User.updateInstitute);

//-- call for student registration
app.post('/api/addStudent', User.addStudent);

//-- call for update student details
app.post('/api/updateStudent', User.updateStudent);

//-- call for get all student list
app.post('/api/getStudentList', User.getStudentList);

//-- call for get student detail
app.post('/api/getStudentDetail', User.getStudentDetail);

//-- call for active and deactive student
app.post('/api/activeOrDeactiveStudent', User.activeOrDeactiveStudent);

//-- call for change password
app.post('/api/changePassword', User.changePassword);

//-- call for forgot password
app.post('/api/forgotPassword', User.forgotPassword);

//-- call for reset password
app.post('/api/resetPassword', User.resetPassword);

//-- call for check username exist or not
app.post('/api/isUsernameAvl', User.isUsernameAvl);

//-- call for get total counts
app.post('/api/getAdminDashboardCounts', User.getAdminDashboardCounts);

//-- call for get total counts
app.post('/api/getStudentDashboardCounts', User.getStudentDashboardCounts);

//-- call for get upcoming 7 days tests for admin dashbord
app.post('/api/getUpcomingTestData', User.getUpcomingTestData);

//-- call for get last year register students for admin dashbord
app.post('/api/lastYearStudentData', User.lastYearStudentData);

//-- call for get last 12 days tests report for student dashbord
app.post('/api/getStudentTestData', User.getStudentTestData);

//-- call for get last 7 speed Tests Data for student dashbord
app.post('/api/getStudentSevenTestData', User.getStudentSevenTestData);

//-- call for verify guest coupon
app.post('/api/verifyGuestCoupon', User.verifyGuestCoupon);

//-- call for Guest Student Login with coupon
app.post('/api/guestLoginOrRegister', User.guestLoginOrRegister);

//-- call for guest User Logout
app.post('/api/guestUserLogout', User.guestUserLogout);

//-- call for get course list
app.post('/api/getCourseList', Course.getCourseList);

//-- call for get institute course
app.post('/api/getInstituteCourse', Course.getInstituteCourse);

//-- call for add course
app.post('/api/addCourse', Course.addCourse);

//-- call for get subject list
app.post('/api/getSubjectList', Course.getSubjectList);

//-- call for get institute subject
app.post('/api/addSubjectInCourse', Course.addSubjectInCourse);

//-- call for add subject
app.post('/api/addSubject', Course.addSubject);

//-- call for edit subject
app.post('/api/editSubject', Course.editSubject);

//-- call for get tag
app.post('/api/getTagList', Course.getTagList);

//-- call for add question
app.post('/api/addQuestion', Course.addQuestion);

//-- call for update question
app.post('/api/updateQuestion', Course.updateQuestion);

//-- call for get question list 
app.post('/api/getQuestionList', Course.getQuestionList);

//-- call for get question
app.post('/api/getQuestion', Course.getQuestion);

//-- call for get Category Subject
app.post('/api/getCategorySubject', Course.getCategorySubject);

//-- call for delete question
app.post('/api/deleteQuestion', Course.deleteQuestion);

//-- call for delete course
app.post('/api/deleteCourse', Course.deleteCourse);

//-- call for delete Subject From Course
app.post('/api/deleteSubjectFromCourse', Course.deleteSubjectFromCourse);

//-- call for Delete Subject add by institute
app.post('/api/deleteSubject', Course.deleteSubject);

//-- call for edit course
app.post('/api/editCourse', Course.editCourse);

//-- call for add series
app.post('/api/addSeries', Test.addSeries);

//-- call for create test
app.post('/api/createTest', Test.createTest);

//-- call for add subject
app.post('/api/addTestSubject', Test.addTestSubject);

//-- call for add subject
app.post('/api/addTestSubjectQuestion', Test.addTestSubjectQuestion);

//-- call for add test in series
app.post('/api/addTestInSeries', Test.addTestInSeries);

//-- call for get test list
app.post('/api/getTestList', Test.getTestList);

//-- call for get particular test
app.post('/api/getTest', Test.getTest);

//-- call for get series list
app.post('/api/getSeriesList', Test.getSeriesList);

//-- call for get test series list
app.post('/api/getTestSeries', Test.getTestSeries);

//-- call for update test
app.post('/api/updateTest', Test.updateTest);

//-- call for get test instruction
app.post('/api/getTestInstruction', Test.getTestInstruction);

//-- call for get test question
app.post('/api/getTestQuestion', Test.getTestQuestion);

//-- call for delete test
app.post('/api/deleteTest', Test.deleteTest);

//-- call for get Student Test List
app.post('/api/getStudentTestList', Test.getStudentTestList);

//-- call for start test
app.post('/api/startTest', Test.startTest);

//-- call for save answer
app.post('/api/updateAnswer', Test.updateAnswer);

//-- call for submit test
app.post('/api/submitTest', Test.submitTest);

//-- call for get test question answers
app.post('/api/getTestQuestionAnswer', Test.getTestQuestionAnswer);

//-- call for get Result list of student
app.post('/api/getStudentResultHistory', Test.getStudentResultHistory);

//-- call for Show Result
app.post('/api/showResult', Test.showResult);

//-- call for delete series
app.post('/api/deleteSeries', Test.deleteSeries);

//-- call for delete test question
app.post('/api/deleteTestSubjectQuestion', Test.deleteTestSubjectQuestion);

//-- call for get test series list for student
app.post('/api/getStudentTestSeriesList', Test.getStudentTestSeriesList);

//-- call for get test question detail
app.post('/api/getTestQuestionDetail', Test.getTestQuestionDetail);

//-- call for get Test Result Detail
app.post('/api/getTestResultDetail', Test.getTestResultDetail);

//-- call for upload image of questions
app.post('/api/uploadQuestionImage', Test.uploadQuestionImage);

//-- call for add test feedback
app.post('/api/addTestFeedback', Test.addTestFeedback);

//-- call for get test feedback
app.post('/api/getTestFeedback', Test.getTestFeedback);

//-- call for edit series
app.post('/api/editSeries', Test.editSeries);

//-- call for change test status publish or unpublish
app.post('/api/changeTestStaus', Test.changeTestStaus);

//-- call for get results of a test
app.post('/api/getResultsOfTest', Test.getResultsOfTest);

//-- call for genearte unique coupon for series
app.post('/api/generateCouponForSeries', Test.generateCouponForSeries);

//-- call for get series coupon list
app.post('/api/getSeriesCouponList', Test.getSeriesCouponList);

//-- call for guest user test LIst
app.post('/api/getGuestUserTestList', Test.getGuestUserTestList);

//-- call for coupon LIst
app.post('/api/getCoupons', Test.getCoupons);

//-- call for delete coupon LIst
app.post('/api/deleteCoupons', Test.deleteCoupons);

//-- call for encode questions
// app.post('/api/base64Encode', Test.base64Encode);

app.listen(PORT, ()=>console.log(`server running at port ${PORT}`));
