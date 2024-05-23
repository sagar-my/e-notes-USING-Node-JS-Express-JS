var express = require('express');
var ch = require('chalk');
var app = express();
var bd = require('body-parser');  
var ed = bd.urlencoded({ extended: false })  
var my = require('mysql');
const flash = require('express-flash');
app.use(express.static('public'));
var session = require('express-session');
app.use(session({
  secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge:600000
  }
}));
app.use(flash());
//database connection

var con = require('./dbcongig/db')

//view engin files

app.use('/', require("./route"))
app.set('view engine', 'ejs');

// view folder router
app.get("/viewstudents.ejs",ed,function(req,res)
{
  if (req.session.loggedin) {
    var sql = "select * from  students_table";
    var a = req.session.username;
con.query(sql, function (err, result) {
  if (err) throw err;
  else {
    res.render('viewstudents', { data: result ,ad_name:a});
  }
  });
	} else {
    req.flash('error', 'Please login first ');
    res.redirect('/');
	}

});
app.get("/viewteachers.ejs",ed,function(req,res)
{
  if (req.session.loggedin) {
		// Output username
    var sql = "select * from  teacher_table";
    var a = req.session.username;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        res.render('viewteachers', { data: result,ad_name:a });
      }
      });
	} else {
    req.flash('error', 'Please login first ');
    res.redirect('/');
	}
});

app.get("/Del",ed,function(req,res)
{
  var a = req.query.em;
var sql = "delete from teacher_table where teacher_email='"+a+"' ";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.redirect('/viewteachers.ejs');
    
});
});

app.get("/Delstudent",ed,function(req,res)
{
  var a = req.query.student_em;
var sql = "delete from students_table where student_email='"+a+"' ";
con.query(sql, function (err, result) {
  if (err) throw err;
  else {
    res.redirect('/viewstudents.ejs');
  }
  });
});


app.get("/login",ed,function(req,res){
res.redirect("/views/login.ejs");
});
app.get("/delnotes",ed,function(req,res)
{
  var a = req.query.del_serialnumber;
  console.log(a);
var sql = "delete from write_notes where Serial_number='"+a+"' ";
con.query(sql, function (err, result) {
  if (err) throw err;
  else {
    res.redirect('/shownotes.ejs');
  }
  });
});


app.post("/regstudent",ed,function(req,res)
{
var A=req.body['fullname'];
var B=req.body['email'];
var c=req.body['pass'];
 var sql = "INSERT INTO students_table VALUES ('"+A+"','"+B+"','"+c+"')";
con.query(sql, function (err, result) {
  if (err) throw err;
  req.flash('message1', "Added Successfuly");
  res.redirect('/reg');
  });
});


app.post("/regteacher",ed,function(req,res)
{
var A=req.body['n1'];
var B=req.body['e1'];
    var c = req.body['p1'];
 
 var sql = "INSERT INTO teacher_table VALUES ('"+A+"','"+B+"','"+c+"')";
con.query(sql, function (err, result) {
  if (err) {
    req.flash('sql_error', "email is duplicated please enter another email");
  }
  req.flash('message1', "Added Successfuly");
  res.redirect('/reg');
  });
});


app.post("/logteacher",ed,function(req,res)
{ 
var A=req.body['e1'];
var B=req.body['p1'];
 
if (A && B) {
  var sql = "select * from teacher_table where teacher_email='"+A+"' and teacher_password='"+B+"'";
con.query(sql, function (err, results) {
  if (err) throw err;

    // If the account exists
  if (results.length > 0) {
    var s = results[0].teacher_name;
    req.flash('message', "Teacher login successfully");
        // Authenticate the user
        var r=req.session.loggedin = true;
        req.session.email = A;
        req.session.username = s;
        var a = req.session.username;
        res.redirect('/teacherhome');
  }
  else {
    req.flash('msg', "Incorrect User name Password");
    res.redirect('/login');
    }			
    res.end();

});
}
else {
  req.flash("mess","please enter email and password")
  res.redirect('/login') 
  res.end();
}
  
});

app.post("/logstudent",ed,function(req,res)
{
var A=req.body['e1'];
var B=req.body['p1'];
 var sql = "select * from students_table where student_email='"+A+"' and student_password='"+B+"'";
con.query(sql, function (err, result) {
    if (err) throw err;
    else
{
var L=result.length;
if(L>0){
 var s = result[0].student_name;
  res.render('studenthome',{data:s});
}
else
res.send("You are InValid USer");
}
  });
});

//admin login autthenication.........

app.post("/adminlogin", ed, function (req, res) {
  var A = req.body['e1'];
  var B = req.body['p1'];

  if (A && B) {
    var sql = "select * from admin where Admin_email='" + A + "' and Admin_password='" + B + "'";
  con.query(sql, function (err, results) {
    if (err) throw err;

			// If the account exists
    if (results.length > 0) {
      var s = results[0].Admin_name;
      req.flash('message', "Admin Login Successfully");
      // Authenticate the user
      var r=req.session.loggedin = true;
      req.session.email = A;
      req.session.username = s;
      var a = req.session.username;
      res.redirect('/adminhome');

    }
    else {
      req.flash('msg', "Incorrect User name Password");
      res.redirect('/');
			}			
			res.end();

  });
  }
  
  else {
    req.flash("mess","please enter email and password")
    res.redirect('/')
		
		res.end();
	}
  
});

//add notes
app.get("/writenotes",ed,function(req,res)
{
  res.render('writenotes.ejs');

});
app.post("/addnotes",ed,function(req,res)
{
  var A=req.body['sub'];
  var b=req.body['topic'];
  var c=req.body['content'];
   var sql = "INSERT INTO write_notes(Subject,Topic,content) VALUES ('"+A+"','"+b+"','"+c+"')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.send("inserted successfully")
    });
});

//Shows notes
app.get("/shownotes",ed,function(req,res)
{

  if (req.session.loggedin) {
		// Output username
    var sql = "select * from  write_notes";
    var a = req.session.username;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        res.render('shownotes', { data: result });
      }
      });
	} else {
    req.flash('error', 'Please login first ');
    res.redirect('/');
	}
});
//show admin notes
app.get("/adminviewnotes", ed, function (req, res) {
  if (req.session.loggedin) {
    // Output username
    var sql = "select * from  write_notes";
    var a = req.session.username;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
        res.render("adminviewnotes", { data: result });
      }
    });
  } else {
    req.flash("error", "Please login first ");
    res.redirect("/");
  }
});

app.get("/studentsshownotes",ed,function(req,res)
{
var sql = "select * from  write_notes";
con.query(sql, function (err, result) {
  if (err) throw err;
  else {
    res.render('studentsshownotes', { data: result });
  }
  });
});

app.listen(5000, function () {
    console.log(ch.blue.bgWhiteBright("Server Started"));
    console.log(ch.green("Server started at 5000"));
});
