const jwt = require('jsonwebtoken')

module.exports = async(req,res,next)=>{
    try{
        const token = await req.headers.authorization.split(" ")[1];
        console.log("this is token from server auth.js : ",token)
        const decodedToken = jwt.verify(token,"TOKEN");
        const user = decodedToken;
        req.user = user;
        next();
    }catch(err){
        console.log(err)
        res.status(401).json({
            error:new Error("Invalid Request")
        })
    }
}