const category = require('../../models/category_schema');



module.exports.getCategories = async (req, res)=>{
  // const categories = await categories.find({});
  if(req.session.admin){
  res.render('page_categories');
}else{
  res.redirect('/admin')
}
}