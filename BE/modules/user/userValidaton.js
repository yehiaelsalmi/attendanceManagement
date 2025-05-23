const {body} = require('express-validator'); 

const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('hourPrice').notEmpty().withMessage('Hour price is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
];

module.exports = userValidation;