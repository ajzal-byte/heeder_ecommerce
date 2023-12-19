module.exports.adminSession = (req, res, next)=>{
  const adminSession = req.session.admin;
  if(!adminSession){
    return res.redirect('/admin/login')
  }
    next();
}