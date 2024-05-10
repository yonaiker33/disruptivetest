const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/ContentController');

// Rutas para Contenidos
router.get('/', ContentController.getContents);
router.get('/library', ContentController.getContentsByRole);
router.get('/themes', ContentController.getContentsByTheme);
router.post('/', ContentController.createContents);
router.put('/', ContentController.updateContent);
router.delete('/', ContentController.deleteContent);

module.exports = router;
