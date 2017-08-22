'use strict';

var express = require('express');
var router = express.Router();
const User = require('../models/user-model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../inc/.config');
const mail = require('../inc/mail');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');


var WEBURL = 'http://localhost:4200';
// WEBURL = 'https://f0fed797.ngrok.io';

/**
 * Route d'ajout d'un nouvel utilisateur (Psuedonyme et mot de passe)
 */

router.put('/register', function (req, res) {
  // Enregistre le pseudonyme, le mot de passe crypté dans la Db
  // Vérifie que le compte n'existe pas déjà dans la Db
  // et retourne le status de l'enregistrement en cas de réussite

  let newUser = new User({
    "firstConn": req.body.firstConn,
    "nickname": req.body.nickname,
    "password": req.body.password,
    "email": req.body.email
  });


  // Ajout de l'utilisateur dans la DB
  User.addUser(newUser, function (err, user) {
    if (err) {
      res.json({
        succeed: false,
        msg: 'Erreur lors de l\'ajout d\'un nouvel utilisateur ' + err
      });
    } else {
      res.json({
        succeed: true,
        msg: 'L\'utilisateur  ' + user + 'a bien été rajouté'
      });
      // Road Trip Social

      let mailContent = 'Bonjour, <br /><br /> Votre compte <span style="color: black;  font - weight: bold;">\' ' + user.nickname + ' \'</span> a bien été créé sur le site Road Trip Social. <br /><br />Un seul lien pour vous connecter : </br><a href="' + WEBURL + '/login" >Road Trip Social -> Login</a ><br /><br /> Partagez vite vos derniers voyages et aventures !<br /><br/> L\'equipe Road Trip Social ';


      mail.sendMail('Road Trip Social <no-reply@roadtripsocial.com>', user.mail, 'Création de compte', mailContent, null, function (err, info) {
        console.log(err, info);
      });
    }
  });
});

/**
 * Enregistrement de la Civilité de l'utilisateur
 */
router.post('/register-civility', function (req, res) {
  // Enregistre le nom, prénom de l'utilisateur dans la DB
  User.addCivility(req.body.nickname, req.body.civility, function (err, user) {
    if (err) {
      res.json({
        succeed: false,
        msg: 'Erreur lors de l\'ajout d\'un nouvel utilisateur ' + err
      });
    } else {
      res.json({
        succeed: true,
        msg: 'L\'utilisateur  ' + user + 'a bien été rajouté'
      });
    }
  });
});

/**
 * Enregistre les pays visités et la description de l'utilisateur dans la Db
 */
router.post('/register-extra-details', function (req, res) {
  // Enregistre les pays visités et la description de l'utilisateur dans la Db
  // Recupération des valeurs passées

  let originalAvatarFileName = req.body.extraDetails.avatar;
  let newAvatarFilenameTab = originalAvatarFileName.split('.');
  newAvatarFilenameTab.pop();
  newAvatarFilenameTab[0] = req.body.nickname;

  let newAvatarFilename = newAvatarFilenameTab.join('.');

  // Remplacement du nom de l'avatar
  req.body.extraDetails.avatar = newAvatarFilename;

  // Enregistrement de l'emplacement du fichier original
  let filePathName = path.join(__dirname, '../../uploads/', originalAvatarFileName);

  // Test si le fichier existe
  fs.access(filePathName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, function (err) {

    if (err) {
      res.json({
        err: "Fichier inexistant"
      });
    } else {
      // Renomme le fichier
      fs.rename(path.join(__dirname, '../../uploads/', originalAvatarFileName), path.join(__dirname, '../../uploads/', newAvatarFilename), function (err) {
        if (err) {
          // debugger
        }

        // Ajout de l'utilisateur dans la DB
        User.addExtraDetails(req.body.nickname, req.body.extraDetails, function (err, user) {
          if (err) {
            res.json({
              succeed: false,
              msg: 'Erreur lors de l\'ajout d\'un nouvel utilisateur ' + err
            });
          } else {
            res.json({
              succeed: true,
              msg: 'L\'utilisateur  ' + user + 'a bien été rajouté'
            });
          }
        });
      });
    }
  });
});


/**
 * Route concernant la connexion de l'utilisateur sur le site
 */
router.post('/login', function (req, res) {
  // Verification du nom de l'utilisateur et du mot de passe associé dans la Db

  const nickname = req.body.nickname;
  const password = req.body.password;

  // Récupération du profil de l'utilisateur à partir de la Db
  User.getUserByNickname(nickname, function (err, user) {
    if (err) {
      res.json({
        'succeed': false
      });
    }

    if (!user) {
      return res.json({
        succeed: false
      });
    }

    // Vérification de la validité du mot de passe
    User.comparePassword(password, user._doc.password, function (err, isMatch) {
      if (err) {
        res.json({
          'succeed': false
        });
      }

      if (isMatch) {
        const token = jwt.sign(user, config.passport.secret, {
          expiresIn: "7d" // 604800 // 1 week
        });

        delete user._doc.password;

        res.json({
          succeed: true,
          token: 'JWT ' + token,
          user: user._doc
        });
      } else {
        res.json({
          succeed: false
        });
      }
    });
  });
});

/**
 * Route d'affichage du profil d'un utilsateur
 */
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  res.json({
    user: req.user
  });
});

/**
 * Route de récupération de l'utilisateur à partir de son adresse email
 */

router.post('/find-user-by-mail', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  User.getUserByMail(req.body.email, function (err, userProfile) {
    if (err) {
      res.json({
        succeed: false
      });
    } else {
      if (userProfile) {
        if (userProfile.email) {
          res.json({
            succeed: true
          });
          // TODO : Envoyer un mail
        } else {
          res.json({
            succeed: false
          });
        }
      } else {
        res.json({
          succeed: false
        });
      }
    }
  });
});

/**
 * Vérification de la disponibilité du pseudonyme
 */
router.post('/nickname-availability', function (req, res) {
  User.getUserByNickname(req.body.nickname, function (err, userProfile) {
    if (err) {
      res.json({
        succeed: false
      });
    } else {
      if (userProfile) {
        res.json({
          succeed: true,
          available: false
        });
      } else {
        res.json({
          succeed: true,
          available: true
        });
      }
    }
  });
});

/**
 * Mise à jour du profil de l'utilisateur
 */
router.post('/update-profile', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  let originalAvatarFileName = req.body.avatar;
  let newAvatarFilenameTab = originalAvatarFileName.split('.');
  newAvatarFilenameTab.pop();
  newAvatarFilenameTab[0] = req.body.nickname;

  let newAvatarFilename = newAvatarFilenameTab.join('.');

  // Remplacement du nom de l'avatar
  req.body.avatar = newAvatarFilename;

  // Enregistrement de l'emplacement du fichier original
  let filePathName = path.join(__dirname, '../../uploads/', originalAvatarFileName);


  // Test si le fichier existe
  fs.access(filePathName, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK, function (err) {

    if (err) {
      res.json({
        err: "Fichier inexistant"
      });
    } else {
      // Renomme le fichier
      fs.rename(path.join(__dirname, '../../uploads/', originalAvatarFileName), path.join(__dirname, '../../uploads/', newAvatarFilename), function (err) {
        if (err) {
          // debugger
        }
        // Sauvegarde le profile dans la Db
        User.updateProfile(req.body, function (err, newUserProfile) {
          if (err) {
            res.json({
              err: err
            });
          } else {
            res.json({
              err: null,
              newProfile: newUserProfile
            });
          }
        });

      });
    }
  });
});

/**
 * Route de mot de passe perdu
 */
router.post('/lost-password', function (req, res) {

  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  var token = crypto.createHash('sha1').update(current_date + random).digest('hex');

  User.getUserByMail(req.body.email, function (err, userProfile) {

    if (err) {
      res.json({
        succeed: false
      });
    } else {
      if (userProfile) {
        if (userProfile._doc.email) {
          // Ajout d'un token de verification
          User.addToken(req.body.email, token, function (err, userP) {
            if (err) {
              res.json({
                succeed: false
              });
            } else {
              res.json({
                succeed: true,
                token: token
              });
            }
          });

        } else {
          res.json({
            succeed: false
          });
        }
      } else {
        res.json({
          succeed: false
        });
      }
    }
  });
});

/**
 * Route de remise à zero du mot de passe
 */
router.post('/reset-password', function (req, res) {

  User.findByToken(req.body.token, function (err, user) {
    if (err) {
      res.json({
        succeed: false
      });
    } else {
      User.resetPassword(req.body.token, req.body.newPass, function (err, result) {
        if (err) {
          res.json({
            succeed: false
          });
        } else {
          res.json({
            succeed: true
          });

          let mailContent = 'Bonjour, <br /><br /> Votre mot de pass <span style="color: black;  font - weight: bold;">\' ' + user.nickname + ' \'</span> a été modifié sur le site Road Trip Social. <br /><br />Un seul lien pour vous connecter : </br><a href="' + WEBURL + '/login" >Road Trip Social -> Login</a ><br /><br /> Partagez vite vos derniers voyages et aventures !<br /><br/> L\'equipe Road Trip Social ';


          mail.sendMail('Road Trip Social <no-reply@roadtripsocial.com>', user.email, 'Réinitialisation du mot de passe', mailContent, null, function (err, info) {
            console.log(err, info);
          });
        }
      });
    }
  });
});

/**
 * Modification du mot de passe de l'utilisateur 
 */
router.post('/change-password', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  // Verification de l'ancien mot de passe
  // Vérification de la validité du mot de passe
  const nickname = req.body.nickname;
  const oldPass = req.body.oldPass;

  // Récupération du profil de l'utilisateur à partir de la Db
  User.getUserByNickname(nickname, function (err, user) {

    if (err) {
      res.json({
        'succeed': false
      });
    }

    if (!user) {
      return res.json({
        'succeed': false
      });
    }

    // Vérification de la validité du mot de passe
    User.comparePassword(oldPass, user._doc.password, function (err, isMatch) {
      if (err) {
        res.json({
          'succeed': false
        });
      }

      if (isMatch) {
        // Mise à jour du nouveau mot de passe

        User.updatePassword(nickname, req.body.newPass, function (err, result) {
          if (err) {
            res.json({
              'succeed': false,
              'txt': err
            });
          } else {
            res.json({
              'succeed': true
            });

            let mailContent = 'Bonjour, <br /><br /> Votre mot de passe a été changé <span style=" color: black;  font - weight: bold;">\' ' + user.email + ' \'</span> a bien été créé sur le site Road Trip Social. <br /><br />Un seul lien pour vous connecter : </br><a href="' + WEBURL + '/login" >Road Trip Social -> Login</a ><br /><br /> Partagez vite vos derniers voyages et aventures !<br /><br/> L\'equipe Road Trip Social ';


            mail.sendMail('Road Trip Social <no-reply@roadtripsocial.com>', user.email, 'Création de compte', mailContent, null, function (err, info) {
              console.log(err, info);
            });

          }
        });

      } else {
        res.json({
          'succeed': false
        });
      }
    });
  });

});

router.post('/search-member', passport.authenticate('jwt', {
  session: false
}), function (req, res) {

  User.searchMembers(req.body.itemToFind, function (err, rslt) {
    console.log('searchMembers /search', err, rslt);
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        err: null,
        membersList: rslt
      });
    }
  });
});

/**
 * Permet de récupérer le détail d'un profil
 */
router.post('/member-details', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  User.memberDetails(req.body.memberId, function (err, memberDetail) {
    if (err) {
      res.json({
        err: err
      });
    } else {
      res.json({
        err: null,
        memberDetails: memberDetail
      });
    }
  });
});


module.exports = router;
