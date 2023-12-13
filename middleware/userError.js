module.exports.errorHandler =  (error, req, res, next)=>{
  console.error(error);
  res.render('page-404');
}