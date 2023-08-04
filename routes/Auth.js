  const express = require('express');
  const { body, validationResult } = require('express-validator');
  const User = require('../models/User');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  const router = express.Router();
  const fetchuser = require('../middleware/fetchuser')
  const JWT_SECRET = "a0f9c6d3b0f8c9a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9";

  //Route 1: Create a user using: POST "/api/auth/create". doesn't require auth

  router.get('/new',(req, res)=>{
    res.send("working fine")
  })

  router.post('/create', [
    body('email','please enter valid email').isEmail(),
    body('name', 'enter a valid name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
  
    try {
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hashSync(req.body.password, salt);
  
      // Add 'await' here to wait for the user creation process to complete
      const user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: secPass
      });
  
      const data = {
        user: {
          id: user.id
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error creating user" }); // Return an appropriate error message
    }
  });
  


  //Route 2: authenticate a user using: POST /api/auth/login
  router.post('/login', [
    body('email', 'Enter valid email').isEmail(),
    body('password', 'Please enter password').exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
  
    const { email, password } = req.body; // Destructure the email and password from the request body
  
    try {
      let user = await User.findOne({ email }); // await the findOne() method
      if (!user) { // Correctly use 'user' instead of 'User'
        return res.status(400).json({ error: "Please login with correct credentials" });
      } 
  
      const passwordCompare = await bcrypt.compare(password, user.password); // await the bcrypt.compare()
  
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please login with correct credentials" });
      }
  
      const data = {
        user: {
          id: user.id
        }
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json(authToken);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Error logging in" }); // Return an appropriate error message
    }
  });



  // Route 3  Get login user details using POST:"/api/auth/getuser" Login required
  router.post('/getuser', fetchuser , async (req, res) => {
  try{
    userId= req.user.id
    let user = await User.findById(userId).select("-password")
    res.send(user)
  }catch(error){
    console.error(error.message)
    res.status(500).send("internal server error")
  }
})


  module.exports = router;
