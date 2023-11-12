const category = require('../../models/category_schema');



module.exports.getCategories = async (req, res)=>{
  if(req.session.admin){
  const categories = await category.find();
  res.render('page_categories', { message: null, categories});
}else{
  res.redirect('/admin')
}
}

module.exports.addCategories = async (req, res)=>{
  const ifExist = await category.findOne({categoryName : req.body.cat_name});
  if(ifExist){
  const categories = await category.find();
  res.render('page_categories', {message: "Category already exists",categories});
  }else{
    
    await category.create({
      categoryName : req.body.cat_name,
      isListed : req.body.cat_status
    });
  const categories = await category.find();
    // console.log("here");
    res.render('page_categories',{message: "Successfully Added",categories}); 
  }
}

module.exports.editCategories = async (req, res)=>{

}
