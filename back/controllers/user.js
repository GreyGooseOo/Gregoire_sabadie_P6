//appel des plugins et code pour le bon fonctionnement du controlleur
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//fonction permettant la création d'un compte
exports.signup = (req, res, next) => {
  //vérification de la presence d'un email dans la creation du compte
  if(!req.body.email){
    return res.status(400).json({ error : 'Paramètre manquant'});
  };
  //vérification de la bonne comformité de l'email grace a une regex
  if(!/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(req.body.email)){
    return res.status(400).json({ error : 'Email non correct'});
  };
  //vérification de la présence d'un mot de passe
  if(!req.body.password){
    return res.status(400).json({ error : 'Paramètre manquant'});
  };
  //haschage du mot de passe dans la base de donnée
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};

//fonction permettant l'identification d'un utilisateur
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            //création du token d'authentification
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN_JWT,
              { expiresIn: '24h' })
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};