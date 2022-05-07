
const setTokens = async (user,res,statuscode)=>{
    const token = await user.getjwtToken();
   
    const options = {
        httpOnly:true,
        expires:new Date(
            Date.now + process.env.COOKIE_EXPIRE*24*60*60*1000
        )
    }
    
    // now attach this token to cookie
    res.status(statuscode).cookie('token',token,options).json({
        success:true,
        user,token,
    })

}
module.exports = setTokens