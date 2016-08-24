var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var passwordHash = require('password-hash');


router.get('/', function(req, res) {
  var locations = [];
  var query = "SELECT DISTINCT city_name FROM locations;"
  pool.getConnection(function(err, connection) {
    connection.query(query, function(err, rows) {
      if(err) {
        console.log('pulling location error: ' + err);
      } else {
        if (rows.length > 0) {
          console.log(rows);
          for (var i = 0; i < rows.length; i++) {
            locations.push(rows[i].city_name);
          }
          console.log(locations);
        }
      }
      res.render('../views/pages/register', {locations : locations});
    });
  });
  
});

router.post('/', function (req, res) {
  var data = req.body;
  console.log(data);
  pool.getConnection(function (err, connection) {
    var query = "select location_id from locations where city_name = '" + req.body.city_name + "';";
    //console.log(query);
    connection.query(query, function (err, rows) {
      if (err) {
        console.log(err);
      } else {
        if (rows.length > 0) {
          var location_id = rows[0].location_id;
          console.log(location_id);
          insertUser(location_id);
        }
      }
    });
  });
  
  var insertUser = function (location_id) {
    var finalData = {
        user_name : data.user_name,
        user_email: data.user_email,
        user_password: passwordHash.generate(data.user_password),
        location_id : location_id
    }
    pool.getConnection(function (err, connection) {
      var query = connection.query('insert into users set ?', finalData, function (err, result) {
        connection.release();
        if (err) {
          console.log(err);
          if (err.code === 'ER_DUP_ENTRY') {
            res.json({isDone : false, msg : "duplicate email!"});
            return;
          }
        } else {
          if (result.affectedRows == 1) {
            res.json({isDone : true, msg : "register done!"});
            return;
          }
        }
      });
    });
  };

});

module.exports = router;