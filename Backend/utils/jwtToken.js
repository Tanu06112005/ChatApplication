import jwt from 'jsonwebtoken'


//signup ke time pe bhi create hoga token as well as signin ke time pe bhi hoga 

const jwtToken = (userId, res)=>{
    const secretKey = process.env.SECRET_KEY 
    const  Token = jwt.sign({userId},secretKey,{expiresIn:'30d'})
    
    // storing token in the cookie (browser/frontend)
    res.cookie('jwtToken',Token,{
        maxAge: 30* 24* 60* 60* 1000,
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.SECURE !== 'development'
    })

}  

export default jwtToken

// httpOnly: true ka simple meaning hai:

// Browser cookie ko JavaScript se access nahi karne dega.

// For example, server se tum cookie bhej rahe ho:

// res.cookie("token", token, {
//     httpOnly: true
// });

// Ab browser ke paas token cookie save ho jayegi, but frontend JavaScript usko directly read nahi kar payega.

// Without httpOnly

// Agar:

// res.cookie("token", token);

// to frontend JavaScript potentially:

// console.log(document.cookie);

// se cookie ko read kar sakta hai.