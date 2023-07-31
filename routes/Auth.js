const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
var bcrypt = require('bcryptjs');


const router = express.Router();

// Create a user using: POST "/api/auth/". doesn't require auth

router.post('/', [
  body('email').isEmail(),
  body('name', 'enter a valid name').isLength({ min: 3 }),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 
  try{
  const salt = await bcrypt.genSaltSync(10);
  const secPass = await bcrypt.hashSync(req.body.password, salt);
  user = await User.create({
    email: req.body.email,
    name: req.body.name,
    password: secPass
  })
  res.json(user)
  // .then(user => res.json(user))
  //   .catch(error => res.status(500).json({ error: "Error creating user" }));

}catch(error) {
  res.json(User)
  console.error(error.message)
}
});

module.exports = router;
