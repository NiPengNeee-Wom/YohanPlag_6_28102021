const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/controllerstest')

// creation de middleware de test avec schema "test"

router.post('/', stuffCtrl.createTest);
router.put('/:id', stuffCtrl.modifyTest);
router.delete('/:id', stuffCtrl.deleteTest);
router.get('/:id', stuffCtrl.getOneTest);
router.get('/', stuffCtrl.getAllTest);

module.exports = router;