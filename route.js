const express = require('express');
var router = express.Router();


router.get('/', (req, res) => {
  res.render('home', { message: req.flash()});
});
router.get('/home.html', (req, res) => {
  res.redirect('/')
});
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  })
});
router.get('/login', (req, res) => {
  res.render('login',{ login_msg: req.flash()});
});
router.get('/admin', (req, res) => {
  res.render('admin');
});
router.get('/reg', (req, res) => {
  res.render('reg',{ message: req.flash()});
});

router.get('/about', (req, res) => {
  res.render('about');
});
router.get('/adminhome', (req, res) => {
  if (req.session.loggedin) {
    var a = req.session.username;
    res.render('adminhome', {data:a});
  } else {
    req.flash('error', 'Please login first ');
    res.redirect('/');
	}
});
router.get('/writenotes', (req, res) => {
  res.render('writenotes');
});
router.get('/teacherhome', (req, res) => {
  if (req.session.loggedin) {
    var a = req.session.username;
    res.render('teacherhome' , { data: a });
  } else {
    req.flash('error', 'Please login first ');
    res.redirect('/');
	}
 
});
router.get('/contact', (req, res) => {
  res.render('contact');
});
router.get('/studenthome', (req, res) => {
  res.render('studenthome');
});
module.exports=router 