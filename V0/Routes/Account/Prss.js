var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Prss';

router.get('/', function(req, res) {
   var email = req.session.isAdmin() && req.query.email ||
    !req.session.isAdmin() && req.session.email;

   var handler = function(err, prsArr) {
      if (!req.session.isAdmin()) {
         prsArr.forEach(function(person) {
            if (person.email !== req.session.email)
               prsArr.splice(prsArr.indexOf(person), 1);
         });
      }

      res.status(200).json(prsArr).end();
      req.cnn.release();
   };

   if (req.query.email) {
      req.cnn.chkQry('select id, email from Person where email like ?',
       [req.query.email + '%'], handler);
   }
   else {
      req.cnn.chkQry('select id, email from Person', [], handler);
   }
});

router.post('/', function(req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password) {
      body.password = "*";                       // Blocking password
   }
   body.whenRegistered = new Date();

   async.waterfall([
      function(cb) { // Check properties and search for Email duplicates
         if (vld.hasFields(body, ["email", "lastName", "role"], cb) &&
          vld.chain(body.password || admin, Tags.missingField, ["password"])
          .chain(body.role === 0 || admin, Tags.noPermission)
          .chain(body.termsAccepted || admin, Tags.noTerms)
          .check(body.role === 0 || body.role === 1, Tags.badValue,
          ["role"], cb)) {
            cnn.chkQry('select * from Person where email = ?',
             body.email, cb);
         }
      },

      function(existingPrss, fields, cb) {  // If no dups, insert new Person
         if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
            if (body.termsAccepted)
               body.termsAccepted = new Date();
            else
               body.termsAccepted = null;

            cnn.chkQry('insert into Person set ?', body, cb);
         }
      },

      function(result, fields, cb) { // Return location of inserted Person
         res.location(router.baseURL + '/' + result.insertId).end();
         cb();
      }],

      function() {
         cnn.release();
      });
});


router.get('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkPrsOK(req.params.id)) {
      req.cnn.query('select email, firstName, lastName, whenRegistered, ' +
       'termsAccepted, role from Person where id = ?', [req.params.id],
      function(err, prsArr) {
         if (vld.check(prsArr.length, Tags.notFound)) {
            prsArr.forEach(function(prs) {
               prs.whenRegistered = new Date(prs.whenRegistered).getTime();
               prs.termsAccepted = new Date(prs.termsAccepted).getTime();
            });
            res.status(200).json(prsArr).end();
         }
         req.cnn.release();
      });
   }
   else
      req.cnn.release();

});

router.put('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var admin = req.session.isAdmin();
   var cnn = req.cnn;

   async.waterfall([
      function(cb) {
         if (vld.checkPrsOK(req.params.id, cb) && vld.hasOnlyFields(body,
          ["firstName", "lastName", "password", "oldPassword", "role"])
          .chain(!body.role || (admin && (body.role === 1 ||
          body.role === 0)), Tags.badValue, ["role"])
          .check(!body.password || body.oldPassword || admin,
          Tags.noOldPwd, null, cb)) {
            cnn.chkQry("select * from Person where id = ? ",
             [req.params.id], cb);
         }
      },

      function(qRes, fields, cb) {
         if (vld.check(qRes.length, Tags.notFound, null, cb) &&
          vld.check(body.password !== "" || body.oldPassword,
          Tags.noOldPwd, null, cb) &&
          vld.check(body.password === undefined || body.password !== "",
          Tags.badValue, ["password"], cb) &&
          vld.check(admin || !body.password || qRes[0].password ===
          body.oldPassword, Tags.oldPwdMismatch, ["oldPassword"], cb)) {
            delete body.oldPassword;
            cnn.chkQry("update Person set ? where id = ?",
             [body, req.params.id], cb);
         }
      },

      function(updRes, field, cb) {
         res.status(200).end();
         cb();
      }],

      function(err) {
         if(err){
            res.status(500).end();
         }
         cnn.release();
      });
});

router.delete('/:id', function(req, res) {
   var vld = req.validator;

   if (vld.checkAdmin()) {
      req.cnn.query('DELETE from Person where id = ?', [req.params.id],
      function (err, result) {
         if (vld.check(result.affectedRows, Tags.notFound) || !err)
            res.status(200).end();
         req.cnn.release();
      });
   }
   else
      req.cnn.release();
});

module.exports = router;
