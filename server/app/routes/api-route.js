'use strict';

var express = require('express');
var router = express.Router();
const User = require('../models/user-model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../inc/.config');
let path = require('path');
const fs = require('fs');

const Posts = require('../models/post-model');

var multer = require('multer');
var upload = multer({
  dest: 'uploads/'
});

/**
 * Permet l'upload d'une image correspondante au profil de l'utilisateur
 */
router.post('/uploadFile', upload.any(), function (req, res) {

  res.json({
    err: null,
    filename: req.files[0].filename
  });
});


/**
 * Permet d'afficher l'image de l'utilisateur
 */
router.get('/display-photo/:img', function (req, res) {
  if (fs.existsSync(path.join(__dirname, '../../uploads', req.params.img))) {
    fs.readFile(path.join(__dirname, '../../uploads', req.params.img), function (err, data) {
      if (err) throw err;
      console.log(data);

      res.send(data);

    });
  } else {
    res.json({
      err: 'File do not exists'
    });
  }
});

/**
 * ajout d'un nouveau post
 */
router.post('/new-post', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  let newPostItem = new Posts({
    "datePost": req.body.datePost,
    "details": req.body.details,
    "autors": req.body.autors,
    "avatar": req.body.avatar
  });

  Posts.addNewPost(newPostItem, function (err, result) {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        err: null,
        post: result._doc
      });
    }
  });
});

/**
 * Récupère le dernier post
 */
router.post('/get-last-post', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  Posts.findLast(req.body.nickname, function (err, data) {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        err: null,
        lastPost: data
      });
    }
  });
});


router.get('/get-post', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  Posts.getPosts(function (err, data) {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        err: null,
        posts: data
      });
    }
  });
});

module.exports = router;
