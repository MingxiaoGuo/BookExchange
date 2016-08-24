var express = require('express');
var router = express.Router();
var pool = require('../routes/mysqlConnection');
var Book = require('../models/book');
var multer = require('multer');



/* GET users listing. */
router.get('/:book_id', function(req, res) {
  if (req.session.user === undefined) {
    return res.redirect("/login");
  }
  var book_id = req.params.book_id;
  var query = "select * from own_books where book_id = " + book_id + ";";
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, rows) {
      if (err) {
        return res.status(404).json({
          message: err
        });
      } else {
        Book.findById(rows[0].book_mongo_id, function (err, result) {
          if (err) {
            return res.status(404).json({
              message: 'MongoDB cannot find this ID: ' + rows[0].book_mongo_id
            });
          }
          var book = {
            book_id: rows[0].book_id,
            book_title: rows[0].book_title,
            book_condition: rows[0].book_condition,
            book_mongo_id: rows[0].book_mongo_id,
            book_path : "../" + result.path
          };
          console.log(book);
          res.render('../views/pages/bookDetail', {userInfo : req.session.user, bookInfo : book});
        });
      }
    });
  });

});

// only update image info
router.put('/updateImage', function (req, res) {

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

  // 没有修改图片
  if (req.file === undefined) {
    console.log("file is empty")
  }

  up(req, res, function(err){
    //console.log(req.body);
    var mongo_id = req.body.book_id;
    console.log(req.file);
    Book.findOne({_id : mongo_id}, function (err, foundObject) {
      if (err) {
        console.log(err);
        return res.status(500);
      }
      if (!foundObject) {
        return res.status(404);
      }

      if (mongo_id) {
        foundObject.path = "/uploads/" + req.file.originalname;
      }
      
      foundObject.save(function (err, updatedObject) {
        if (err) {
          console.log("update err" + err);
          return res.status(404);
        }
        res.send(updatedObject);
      });
    });
  });


});

router.post('/updateInfo', function (req, res) {
  console.log(req.body);
  var query = "update own_books set book_title = '" + req.body.book_title + "', book_condition = '" + req.body.book_condition + "' where book_id = " + req.body.book_id + ";";
  console.log(query);
  
  pool.getConnection(function (err, connection) {
    connection.query(query, function (err, result) {
      connection.release();
      console.log(result.affectedRows);
      if (err) {
        console.log(err);
        return res.json({isDone : false, msg : err.code})
      }

      if (result.affectedRows == 1) {
        return res.json({isDone : true, msg : "book updated!"});
      }
    });
  });
});

module.exports = router;