const express = require('express');
const userController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

// Endpoint para registro de usuarios
router.post('/register', async (req, res) => {
  try {
    const response = await userController.createUser(req.body);
    res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Endpoint para inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const response = await userController.getUser(req.body)
    res.status(200).send(response);
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Invalid login credentials.' });
  }
});

// Endpoint para inicio de sesión por token
router.get('/authtoken', authMiddleware, async (req, res) => {
  try {
    const userWithoutPassword = { ...req.user.toObject() };
    delete userWithoutPassword.password;
    const response = { token: req.token, user: userWithoutPassword}
    res.status(200).send(response);
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: 'Invalid login credentials.' });
  }
});

module.exports = router;
