//appel des plugins et code pour le bon fonctionnement du routeur
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

//gestion de création/identification de compte
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;