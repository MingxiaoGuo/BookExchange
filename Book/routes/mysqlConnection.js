var mysql = require('mysql');
// mysql db connection pool setup
var mysqlPool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'book'
});
//Open mysql connection
mysqlPool.getConnection(function(err){
    if(!err) {
        console.log("Database is connected ... ");
    } else {
        console.log(err)
        console.log("Error connecting database ... ");
    }
});

module.exports = mysqlPool