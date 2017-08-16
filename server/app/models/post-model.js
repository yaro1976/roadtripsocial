'use strict';

const mongoose = require('mongoose');

// Création du schéma à la base de données

let postSchema = mongoose.Schema({
  datePost: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  autors: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "Anonymous.png"
  },
  commentTo: {
    type: Number
  }
});

var posts = module.exports = mongoose.model('Posts', postSchema);

// Récupère un post
posts.getPostElement = function (owner, callback) {
  post.findOne({
    owner: owner
  }, callback);
}

/**
 * Ajoute un nouveau post
 */
posts.addNewPost = function (newPost, callback) {
  newPost.save(callback);
}

/**
 * Récupère le dernier post d'un utilisateur
 */
posts.findLast = function (nickname, callback) {
  posts.findOne({
    autors: nickname
  }, {

    }, {
      sort: { 'datePost': -1 }
    },
    callback);
};
