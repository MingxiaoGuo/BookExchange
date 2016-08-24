/**
 * Created by Mingxiao on 8/23/2016.
 */
var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var Book = require('../models/book');

router.get('/:id', function (req, res) {
  console.log(req.params.id);
  var query = "select * from users, own_books, locations where users.user_id = own_books.owner_id and users.location_id = locations.location_id and book_id = " + req.params.id + ";";
  console.log(query);
  pool.getConnection(function (err, connection) {
    if (err) {
      console.log(err);
      return res.status(404);
    }
    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
        return res.status(404);
      }
      console.log(rows);

      Book.findById(rows[0].book_mongo_id, function (err, result) {
        // console.log(result);
        if (err) {
          consolo.log(err);
          return res.status(404).json({
            message: 'MongoDB cannot find this ID: ' + rows[0].book_mongo_id
          });
        }

        var book = {
          user_id: rows[0].user_id,
          user_email: rows[0].user_email,
          user_name: rows[0].user_name,
          location_id: rows[0].location_id,
          book_id: rows[0].book_id,
          book_title: rows[0].book_title,
          book_condition: rows[0].book_condition,
          book_mongo_id: rows[0].book_mongo_id,
          city : rows[0].city_name,
          book_path : "../" + result.path
        };
        console.log(book);
        getWishBookList(book);
      });

    });
  });
  
  var getWishBookList = function (book) {
    var query = "select * from want_books where user_id = " + book.user_id + ";";
    pool.getConnection(function (err, connection) {
      if (err) {
        console.log(err);
        return res.status(404);
      }
      connection.query(query, function (err, rows) {
        connection.release();
        if (err) {
          console.log(err);
          return res.status(404);
        }
        console.log(rows);
        var bookList = [];
        for (var i = 0; i < rows.length; i++) {
          bookList.push({
            book_title : rows[i].book_title
          });
        }

        book["wishBookList"] = bookList;
        console.log(book);
        res.render('../views/pages/bookInfo', {data : book, userInfo : req.session.user});
      });
    });
  }
});


module.exports = router;