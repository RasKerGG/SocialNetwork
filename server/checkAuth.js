import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET_KEY = process.env.JWT_SECRET

export const checkAuth = (req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Authentication failed. Token not provided." });
    }
    jwt.verify(token,JWT_SECRET_KEY,(error,decoded)=>{
        if(error){
            return res.status(401).json({message:"Authentication failed. Invalid token."});
        }
        req.user = decoded;
        next(); // переход к работе контроллера 
    })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });  
    }
}