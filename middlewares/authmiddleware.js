const jwt = require('jsonwebtoken');

const autoriseUser = (requiredRole) =>{
    return (req,res,next) =>{
        try {
            console.log("request aai h middleware tak");
            const token = req.cookies.token;
            
            if(!token){
                return res.status(401).json({message:"no token provided"})
            }
            console.log("token bhi mila");
            const decoded = jwt.verify(token,process.env.JWT_TOKEN);
            
            req.user = decoded;

            if(req.user.role !== requiredRole){
               return res.status(400).json({message:`Access denied only ${requiredRole}s are allowed`});
            }
            console.log("allowed from authmiddleware");
            next();
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = {
    authenticateAdmin: autoriseUser("admin"),
    authenticateStudent: autoriseUser("student"),
    authenticateInstructor: autoriseUser("instructor")
};