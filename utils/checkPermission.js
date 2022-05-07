
const checkPermission = (requestUser,resourceUserId) =>{
    
    if(requestUser.role==='admin') return true;
    if(requestUser._id.toString() === resourceUserId.toString()) return true;
    return false;
}

module.exports = checkPermission;