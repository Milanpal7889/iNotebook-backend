const jwt = require('jsonwebtoken');
const JWT_SECRET = "a0f9c6d3b0f8c9a5f6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9";

const fetchuser = (req, res, next)=>{
    // Get the user from the jwt token and add id to req object

    const token = req.header('authToken')
    if(!token){
        res.status(500).send({error:"token is invalid"})
    }
    try{
        const string = jwt.verify(token, JWT_SECRET)
        req.user = string.user
        next()
    }catch(error){
        res.status(401).send({error:"please authenticate using a valid token"});
    }
}


module.exports = fetchuser;