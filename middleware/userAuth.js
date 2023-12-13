module.exports.userSession = (req, res, next)=>{
  const userSession = req.session.user;
  if(!userSession){
    return res.redirect('/login')
  }
    next();
}