const express = require('express');
const router = express.Router();
const ThemeController = require('../controllers/ThemeController');

// Rutas para temáticas
router.get('/', ThemeController.getAllThemes);
router.post('/', ThemeController.createTheme);
router.put('/:id', ThemeController.updateTheme);
router.delete('/:id', ThemeController.deleteTheme);

module.exports = router;
