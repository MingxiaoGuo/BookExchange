/**
 * Created by Mingxiao on 8/19/2016.
 */
var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var Book = require('../models/book');
var multer = require('multer');

// render book list
// including get own_book and want_book
router.get('/', function (req, res) {
  if (req.session.user === undefined) {
    return res.redirect("/login");
  }
  console.log("in list");
  var ownBookList = [];
  var wantBookList = [];

  var bookquery = "select * from own_books where owner_id = " + req.session.user.user_id + ";";
  var wishBookQuery = "select * from want_books where user_id = " + req.session.user.user_id + ";";
  pool.getConnection(function (err, connection) {
    connection.query(bookquery, function (err, rows) {
/*
      connection.release();
*/
      if (err) {
        console.log(err);
        return res.status(404).json({error : err});
      } else {
        for (var i = 0; i < rows.length; i++) {
          ownBookList.push({
            book_id: rows[i].book_id,
            book_title: rows[i].book_title,
            book_condition: rows[i].book_condition,
            book_mongo_id: rows[i].book_mongo_id
          });
        }

        console.log(ownBookList);
        getWishBookList(wishBookQuery);
      }
    });
  });
  
  var getWishBookList = function (query) {
    pool.getConnection(function (err, connection) {
      connection.query(query, function (err, rows) {
        if (err) {
          console.log(err);
          return res.status(404).json({error : err});
        }
        for (var i = 0; i < rows.length; i++) {
          wantBookList.push({
            book_id: rows[i].book_id,
            book_title: rows[i].book_title
          });
        }
        return res.render("../views/pages/bookList", {
          ownBookList: ownBookList,
          wantBookList : wantBookList,
          userInfo: req.session.user
        });
      })
    });
  }
});

// add own book
// including upload image
// upload image
router.post('/uploadImage', function (req, res) {

  var maxSize = 5 * 1024 * 1024; // set up max size of image(5MB)
  // configure storage options
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });

  var upload = multer({
    storage: storage,
    limits: {fileSize: maxSize}
  });
  // configure single upload file option
  var up = upload.single('image');

  up(req, res, function(err){
    console.log(req.body);
    console.log(req.file);
    if (err) {
      console.log(err);
      return res.json({isDone : false, msg : err.code});
    }

    //return res.json({isDone : true, msg : "pic uploaded"});
    var book = new Book({
      title : req.body.title,
      path : "/uploads/" + req.file.originalname,
      image : req.file.mimetype
    });
    // console.log(book);

    book.save(function(err, result) {
      if(err) {
        console.log(err);
      } else {
        // console.log(result);
        var book_mongo_id = result._id;
        var bookInstance = {
          book_title : req.body.title,
          owner_id : req.session.user.user_id,
          book_condition : req.body.condition,
          book_mongo_id : book_mongo_id
        };
        pool.getConnection(function (err, connection) {
          var query = connection.query('insert into own_books set ?', bookInstance, function (err, rows) {
            connection.release();
            if (err) {
              console.log(err);
              res.json({isDone : false, msg : err.code})
            } else {
              if (rows.affectedRows == 1) {
                res.json({isDone : true, msg : "book added"});
              }
            } // end err else
          });
        });
      } // end else
    });
  });
});


router.post('/addWishBook', function (req, res) {
  var query = "insert into want_books (book_title, user_id) values ( '" + req.body.book_title + "', " + req.session.user.user_id + ");";
  console.log(query);
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, result) {
      connection.release();
      console.log(result);
      if (err) {
        return res.json({isDone : false, msg : "Cannot Add Book!"});
      }
      console.log(result);
      if (result.affectedRows === 1) {
        return res.json({isDone : true, msg : "book added!"});
      }
    });
  });
});

router.post('/deleteWishBook', function (req, res) {
  console.log(req.body);
  var book_id = req.body.book_id;
  var query = "delete from want_books where book_id = " + book_id + " and user_id = " + req.session.user.user_id + ";";
  console.log(query);
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, result) {
      connection.release();
      if (err) {
        return res.json({isDone : false, msg : "Cannot Delete Book!"});
      }
      //console.log(result);
      if (result.affectedRows === 1) {
        return res.json({isDone : true, msg : "Book Deleted!"});
      }
    });
  });
});

module.exports = router;