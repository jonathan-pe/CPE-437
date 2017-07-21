var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({caseSensitive: true});
var async = require('async');

router.baseURL = '/Cnvs';

router.get('/', function(req, res) {
   if (req.query.owner) {
      req.cnn.chkQry('select id, title, lastMessage, ' +
       'ownerId from Conversation where ownerId = ?', req.query.owner,
      function(err, cnvs) {
         if (!err) {
            cnvs.forEach(function(cnv) {
               if (cnv.lastMessage)
                  cnv.lastMessage = new Date(cnv.lastMessage).getTime();
            });
            res.json(cnvs);
         }
         req.cnn.release();
      });
   }

   else {
      req.cnn.chkQry('select id, title, lastMessage, ' +
       'ownerId from Conversation', null,
      function(err, cnvs) {
         if (!err) {
            cnvs.forEach(function(cnv) {
               if (cnv.lastMessage)
                  cnv.lastMessage = new Date(cnv.lastMessage).getTime();
            });
            res.json(cnvs);
         }
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
         cnn.chkQry('select id, title, lastMessage, ' +
          'ownerId from Conversation where id = ?', req.params.id, cb);
      },

      function(results, fields, cb) {
         if (vld.check(results.length, Tags.notFound, null, cb)) {
            results.forEach(function(result) {
               if (result.lastMessage)
                  result.lastMessage = new Date(result.lastMessage).getTime();
            });
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

router.post('/', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var title = body.title;

   async.waterfall([
      function(cb) {
         if (vld.hasFields(body, ["title"], cb) &&
          vld.check(body.title.length <= 80, Tags.badValue, ["title"], cb)) {
            cnn.chkQry('select * from Conversation where title = ?',
             title, cb);
         }
      },

      function(existingCnv, fields, cb) {
         if (vld.check(!existingCnv.length, Tags.dupTitle, null, cb)) {
            body.ownerId = req.session.id;
            cnn.chkQry('insert into Conversation set ?', body, cb);
         }
      },

      function(insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         cb();
      }],

      function() {
         cnn.release();
      });
});

router.put('/:cnvId', function(req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var title = body.title;

   async.waterfall([
      function(cb) {
         if (vld.hasOnlyFields(body, ["title"]) &&
          vld.chain(body.title !== "", Tags.missingField, ["title"])
          .check(!body.title || body.title.length <= 80, Tags.badValue,
          ["title"], cb)) {
            cnn.chkQry('select * from Conversation where id = ?',
             cnvId, cb);
         }
      },

      function(cnvs, fields, cb) {
         if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(cnvs[0].ownerId, cb)) {
            cnn.chkQry('select * from Conversation where id <> ? ' +
             '&& title = ?', [cnvId, body.title], cb);
         }
      },

      function(sameTtl, fields, cb) {
         if (vld.check(!sameTtl.length, Tags.dupTitle, null, cb)) {
            cnn.chkQry("update Conversation set title = ? where id = ?",
             [body.title, cnvId], cb);
         }
      },

      function(results, fields, cb) {
         res.status(200).end();
         cb();
      }],

      function(err) {
         if (!err)
            res.status(200).end();
         req.cnn.release();
      });
});

router.delete('/:cnvId', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;

   async.waterfall([
      function(cb) {
         cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
      },

      function(cnvs, fields, cb) {
         if (vld.check(cnvs.length, Tags.notFound, null, cb) &&
          vld.checkPrsOK(cnvs[0].ownerId, cb)) {
            cnn.chkQry('delete from Conversation where id = ?',
             [cnvId], cb);
         }
      },

      function(result, fields, cb){
         if (vld.check(result.affectedRows, Tags.queryFailed, null, cb))
            cnn.chkQry('delete from Message where cnvId = ?', [cnvId], cb);
      }],

      function(err) {
         if (!err)
            res.status(200).end();
         cnn.release();
      });
});

router.get('/:cnvId/Msgs', function(req, res) {
   var vld = req.validator;
   var cnvId = req.params.cnvId;
   var cnn = req.cnn;
   var query = 'select m.id as id, whenMade, ' +
    'email, content from Conversation c join Message m ' +
    'on cnvId = c.id join Person p on prsId = p.id where c.id = ?';
   var params = [cnvId];

   // And finally add a dateTime/limit clause and parameter if indicated.
   if (req.query.dateTime !== undefined) {
      query += ' and whenMade < ?';
      params.push(new Date(parseInt(req.query.dateTime)));
   }

   query += ' order by whenMade, id';

   if (req.query.num !== undefined) {
      query += ' limit ?';
      params.push(parseInt(req.query.num));
   }

   async.waterfall([
      function(cb) {  // Check for existence of conversation
         cnn.chkQry('select * from Conversation where id = ?', [cnvId], cb);
      },

      function(cnvs, fields, cb) { // Get indicated message
         if (vld.check(cnvs.length, Tags.notFound, null, cb))
            cnn.chkQry(query, params, cb);
      },

      function(msgs, fields, cb) { // Return retrieved messages
         msgs.forEach(function(msg){
            msg.whenMade = new Date(msg.whenMade).getTime();
         });
         res.json(msgs);
         cb();
      }],

      function(err){
         cnn.release();
      });
});

router.post('/:cnvId/Msgs', function(req, res){
   var vld = req.validator;
   var cnn = req.cnn;
   var cnvId = req.params.cnvId;
   var now;

   async.waterfall([
      function(cb) {
         if (vld.hasFields(req.body, ["content"], cb))
            cnn.chkQry('select * from Conversation where id = ?',
             [cnvId], cb);
      },

      function(cnvs, fields, cb) {
         if (vld.check(cnvs.length, Tags.notFound, null, cb))
            cnn.chkQry('insert into Message set ?',
             {cnvId: cnvId, prsId: req.session.id,
             whenMade: now = new Date(),
             content: req.body.content}, cb);
      },

      function(insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         cnn.chkQry("update Conversation set lastMessage = ? where id = ?",
          [now, cnvId], cb);
      }],

      function(err) {
         cnn.release();
      });
});

module.exports = router;
