import jwt from 'jsonwebtoken'

export const generateToken = (id,role)=>{

    try{
        const token = jwt.sign({id,role},process.env.JWT_TOKEN_KEY, { expiresIn: "30d" })
        return token
    }catch(error){
        console.log(error);
    }
}
