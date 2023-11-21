const category = require('../../models/category_schema');


// view category
module.exports.getCategories = async (req, res)=>{
  try{
    if(req.session.admin){
      const categories = await category.find();
      res.render('page_categories', { categories});
    }else{
      res.redirect('/admin')
    }
  }catch (error) {
    console.error(error);
  }
}

// add category
module.exports.addCategories = async (req, res)=>{
  try{
    const ifExist = await category.findOne({categoryName : req.body.cat_name});
  if(ifExist){
  const categories = await category.find();
  res.render('page_categories', {message: "Category already exists",categories});
  }else{
    
    await category.create({
      categoryName : req.body.cat_name,
      isListed : req.body.cat_status
    });
    res.redirect('/admin/categories');
  }
  }catch (error) {
    console.error(error);
  }
}

//view edit category page
module.exports.editCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
  const category_edit = await category.findById(category_id);
  res.render('edit_category', {category_edit})
  }catch (error) {
    console.error(error);
  }
}
  // module.exports.editCategories = async (req, res)=>{
  //   try{
  //     const category_id = req.params.category_id;
  //     const ifExist = await category.findOne({categoryName : req.body.cat_name, _id : {$ne:category_id}});
  //     if(ifExist){
  //    const category_edit = await category.findById(category_id);
  //    return res.render('edit_category', {category_edit, message: "Category already exists"});
  //     }
  //   const category_edit = await category.findById(category_id);
  //   res.render('edit_category', {category_edit})
  //   }catch (error) {
  //     console.error(error);
  //   }
  // }

module.exports.updateCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
    const ifExist = await category.findOne({categoryName : req.body.cat_name, _id : {$ne:category_id}});
    if(ifExist){
      const category_edit = await category.findById(category_id);
      res.render('edit_category', {category_edit, message: "Category already exists"})    
    }
    await category.findByIdAndUpdate(category_id, {
    categoryName: req.body.cat_name,
      isListed: req.body.cat_status
    });
    res.redirect('/admin/categories');
  }catch (error) {
    console.error(error);
  }
}

module.exports.blockCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
    await category.findByIdAndUpdate(category_id, {isListed: 'Inactive'});
    const categories = await category.find(); 
    res.render('page_categories', {categories});
  }catch (error) {
    console.error(error);
  }
}

module.exports.unblockCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
    await category.findByIdAndUpdate(category_id, {isListed: 'Active'});
    const categories = await category.find(); 
    res.render('page_categories', {categories});
  }catch (error) {
    console.error(error);
  }
}