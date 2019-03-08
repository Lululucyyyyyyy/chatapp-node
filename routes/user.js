const express = require('express');
const router = express.Router();
const User = require('../models/User');
const cookie = require('node-cookie')

router.post('/login', function (req, res, next) {
  //expect username password
  User.findOne(req.body)
  .then((user) => {
    if (user) {
      if (req.body.password === user.password) {
        newUser = {id: req.body.id, password: req.body.password};
        req.session.user = newUser;
        res.redirect(`/user/u/${req.body.username}`);
      } else {
        res.send(400, {err: 'Incorrect password'});
        res.render('error');
      }
    } else {
      // if no user exists
      res.send(400, {err: 'No user'});
    }
  })
  .catch((err) => {
    res.send(500, err);
  });
});

router.get('/login', function(req, res, next){
  res.render('login');

});

router.get('/register', function(req, res, next){
  res.render('register');
})

router.post('/register', function(req, res, next){
  User.findOne(req.body)
  .then((userExists) =>{
    if(userExists) {
      res.send(403, {err: 'Username already exists'});
      res.render('error');
    } else{
      newUser = {id: req.body.id, password: req.body.password};
      req.session.user = newUser;
      console.log('registered a new user', req.session);
      return User.create(req.body.username, req.body.password);

    }
  })
  .then((userCreated) =>{
    res.redirect('/user/u/:username');
  })
  .catch((err) => {
    res.send(500, {err})
  });
});

function checkSignIn(req, res, next){
  if(req.session.user){
    next();
  } else {
    var err = new Error("Not logged in");
    console.log(req.session.user);
    next(err);
  }
}

router.get('/u/:username', checkSignIn, function(req, res){
  res.render('protected_page',{id: req.session.user.id})
});

// Wildcard route
router.get('/*', function(req, res, next) {
  res.render('index', { title: 'Chat App' });
});

module.exports = router;