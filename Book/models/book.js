var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  title : String,
  path : String,
  image : Buffer
});

module.exports = mongoose.model('Book', schema);