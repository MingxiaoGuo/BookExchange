var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var passwordHash = require('password-hash');

// router that get to root path
router.get('/', function(req, res) {
  console.log(req.session.user);
  if (req.session.user === undefined) {
    return res.redirect("/login");
  }

  var profile;

  var query = "select * from users natural join locations where user_id = " + req.session.user.user_id + ";";
  // pull user information
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
          console.log(err);
          res.render("../views/pages/profile", {userProfile : profile, userInfo : req.session.user});
      } else {
        //console.log(rows.length);
        if (rows.length > 0) {
          profile = {
            user_id: rows[0].user_id,
            user_email: rows[0].user_email,
            user_password: rows[0].user_password,
            user_name: rows[0].user_name,
            city_name: rows[0].city_name
          };
        }
        console.log(profile);
        res.render("../views/pages/profile", {userProfile: profile, userInfo: req.session.user});
      }
    });
  });

});

router.post('/update', function (req, res) {
  console.log(req.body);

  var user_name = req.body.user_name;
  var password = req.body.password;
  var location = req.body.location;

  var query = "select location_id from locations where city_name = '" + location + "';";

  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
        console.log(err);
        return res.json({isDone : false});
      }
      var location_id = rows[0].location_id;
      updateUser(location_id);
    });
  });
  
  var updateUser = function (location_id) {
    query = "update users set user_name = '" + user_name + "', user_password = '" + passwordHash.generate(password) + "', location_id = " + location_id + " where user_id = " + req.session.user.user_id + ";";
    console.log(query);
    pool.getConnection(function (err, connection) {
      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          console.log(err);
          return res.json({isDone : false});
        }
        console.log(rows);
        if (rows.affectedRows == 1) {
          req.session.user.user_name = user_name;

          return res.json({isDone : true});
        }
        return res.json({isDone : false});
      });
    });
  }
});
module.exports = router;