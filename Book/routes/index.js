var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var mongoose = require('mongoose');
var Book = require('../models/book');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('../views/pages/index');
});
*/
//第二版本index，修改nav保持user logged in
router.get('/', function(req, res) {

  var query = "SELECT  DISTINCT * FROM own_books ORDER BY book_condition Limit 4";

  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      connection.release();
      //console.log(rows);
      var ids = [];
      for (var i = 0; i < rows.length; i++) {
        ids.push(mongoose.Types.ObjectId(rows[i].book_mongo_id));
      }

      var path = [];
      Book.find({
        '_id' : { $in : ids }
      }, function (err, result) {
        if (err) {
          console.log(err);
        }
        //console.log(result[0]);
        var bookData = [];
        for (var j = 0; j < result.length; j++) {
          bookData.push({
            bookPath : ".." + result[j].path
          });
        }
        console.log("bookDta:");
        console.log(bookData);

        if (typeof(req.session.user) != 'undefined') {
          return res.render('../views/pages/index', {userInfo : req.session.user, bookData : bookData});
        } else {
          return res.render('../views/pages/index', {bookData : bookData});
        }

      });

    });
  });
});

router.post('/search', function (req, res) {
  console.log(req.body);
  var bookNameForSearch = req.body.search_term.toLowerCase();
  var query = "select * from own_books, users where own_books.owner_id = users.user_id and lower(book_title) like '%" + bookNameForSearch + "%';";
  console.log(query);
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      if (err) {
        return res.status(404).json({
          message : "cannot query",
          messageBody : err
        });
      }
      if (rows.length === 0) {
        return res.json()
      }
      var searchResult = [];
      for (var i = 0; i < rows.length; i++) {
        searchResult.push({
          book_id: rows[i].book_id,
          book_title: rows[i].book_title,
          owner_id: rows[i].owner_id,
          book_condition: rows[i].book_condition,
          book_mongo_id: rows[i].book_mongo_id,
          user_id : rows[i].user_id,
          user_email : rows[i].user_email,
          user_name : rows[i].user_name
        });
      }
      console.log(searchResult);

      res.render('../views/pages/searchResult', {searchResult : searchResult});
    });
  });

});


module.exports = router;
