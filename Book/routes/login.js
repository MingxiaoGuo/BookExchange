var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var passwordHash = require('password-hash');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('../views/pages/login');
});

router.post('/', function (req, res, next) {
  var loginData = req.body;
  var query = "select user_id, user_name, user_password, user_email from users where user_email = '" + loginData.user_email + "';";
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      if (!err) {
        if (rows.length > 0) {
          var dbPassword = rows[0].user_password;

          if (passwordHash.verify(dbPassword, req.body.user_password)) {
            res.json({isDone : false, msg : "password incorrect"});
            return;
          }
          console.log(rows[0])
          req.session.user = {
            user_id : rows[0].user_id,
            user_name : rows[0].user_name,
            user_email : rows[0].user_email
          }
          console.log(req.session.user);
          res.json({isDone : true, msg : req.session.user});
        } else {
          res.json({isDone : false, msg : "wrong email"});
        }
      } else {
        console.log(err);
        res.json({isDone : false, msg : err});
      }
    });
  });
});

module.exports = router;
