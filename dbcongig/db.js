var my = require('mysql');
var con = my.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
  database:"express_enotes"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
module.exports = con;