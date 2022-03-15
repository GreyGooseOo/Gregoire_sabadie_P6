const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const saucesCtlr = require('../controllers/sauces');
const multer = require('../middleware/multer-config')

router.post('/',auth,multer, saucesCtlr.createSauce);
router.get('/:id',auth, saucesCtlr.getOneSauce);
router.put('/:id',auth,multer, saucesCtlr.modifySauce);
router.delete('/:id',auth, saucesCtlr.deleteSauce);
router.get('/',auth, saucesCtlr.getAllSauces);

module.exports = router;