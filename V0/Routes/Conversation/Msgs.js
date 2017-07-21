var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Msgs';

router.get('/', function(req, res) {
   if (req.query.owner) {
      req.cnn.chkQry('select (UNIX_TIMESTAMP(whenMade)*1000) as whenMade, ' +
       'email, content from Message m join Person on prsId = p.id ' +
       'where prsId = ?', req.query.owner,
      function(err, cnvs) {
         if (!err)
            res.json(cnvs);
         req.cnn.release();
      });
   }

   else {
      req.cnn.chkQry('select whenMade, email, content from Message m join' +
       'Person on prsId = m.id', null,
      function(err, cnvs) {
         if (!err)
            res.json(cnvs);
         req.cnn.release();
      });
   }
});

router.get('/:id', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
      function(cb) {
         cnn.chkQry('select (UNIX_TIMESTAMP(whenMade)*1000) as whenMade, ' +
          'email, content from Message m join Person p on prsId = p.id ' +
          'where m.id = ?', req.params.id, cb);
      },

      function(results, fields, cb){
         if (vld.check(results.length, Tags.notFound, null, cb)) {
            res.json(results[0]);
            res.status(200).end();
            cb();
         }
      }],

      function() {
         cnn.release();
      }
   );
});

module.exports = router;
