module.exports.userSession = (req, res, next)=>{
  const userSession = req.session.user;
  console.log("session in userAuth:" + userSession);
  if(!userSession){
    return res.redirect('/login')
  }
    next();
}