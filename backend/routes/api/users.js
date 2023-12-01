const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Username is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),  
    handleValidationErrors
  ];

// Sign up
router.post('/', validateSignup, async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      // Check if User already exists with specified email
      const existingEmail = await User.findOne({ where: { email: email } });
      // if User exists, throw error for user existing with email
      if (existingEmail){
        const err = new Error('User already exists');
        err.status = 500;
        err.msg = 'User already exists';
        err.errors = { email: 'User with that email already exists' };
        throw err;
      }
      // Check if User already exists with specified username
      const existingUserName = await User.findOne({ where: { username: username } });
      if (existingUserName){
        const err = new Error('User already exists');
        err.status = 500;
        err.msg = 'User already exists';
        err.errors = { email: 'User with that username already exists' };
        throw err;
      }

      // Create a new User
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );
  



module.exports = router;