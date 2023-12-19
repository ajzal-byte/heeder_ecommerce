module.exports.adminSession = (req, res, next)=>{
  const adminSession = req.session.admin;
  if(!adminSession){
    console.log('redirecting to login');
    return res.redirect('/admin/login')
  }
  console.log('next');
    next();
}