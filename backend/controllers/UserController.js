const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (userData) => {
    try {
        const user = await User.findByCredentials(userData.email, userData.password);
        const token = await user.generateAuthToken();
        const userWithoutPassword = { ...user.toObject() };
        delete userWithoutPassword.password;
        return { token, userWithoutPassword };
    } catch (error) {
        throw new Error(error.message);
    }
};

exports.createUser = async (userData) => {
    try {
      const existingUser = await User.findOne({ username: userData.username });
      const existingEmail = await User.findOne({ email: userData.email });
  
      if (existingUser || existingEmail) {
        return ({ error: 'Username already exists.' });
      }
  
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
  
      const user = new User(userData);
      await user.save();
  
      return { user };
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the user.');
    }
  };
  