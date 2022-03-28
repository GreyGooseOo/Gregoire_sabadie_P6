//appel des plugins et code pour le bon fonctionnement du routeur
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const saucesCtlr = require('../controllers/sauces');
const multer = require('../middleware/multer-config')

//gestion des différentes option d'implantation dans l'API
router.post('/', auth, multer, saucesCtlr.createSauce);
router.get('/:id', auth, saucesCtlr.getOneSauce);
router.put('/:id', auth, multer, saucesCtlr.modifySauce);
router.delete('/:id', auth, saucesCtlr.deleteSauce);
router.get('/', auth, saucesCtlr.getAllSauces);
router.post('/:id/like',auth, saucesCtlr.likeSauce);

module.exports = router;