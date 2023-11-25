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
    const categoryName = req.query.categoryName;
    // console.log(categoryName);
    const ifExist = await category.findOne({categoryName});
  if(ifExist){
    res.status(200).json({error: "Category already exists"})
  }else{
    
    await category.create({
      categoryName,
      isListed : "Active"
    });
    // res.redirect('/admin/categories');
    res.status(200).json({ success: true });
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


module.exports.updateCategories = async (req, res)=>{
  try{
    const categoryID = req.query.categoryID;
    const categoryName = req.query.categoryName
    const ifExist = await category.findOne({categoryName, _id : {$ne:categoryID}});
    console.log(ifExist)
    if(ifExist){
      // const category_edit = await category.findById(categoryID);
      // res.render('edit_category', {category_edit, message: "Category already exists"})    
      res.status(200).json({error: "Category already exists"})
    }else{
      await category.findByIdAndUpdate(categoryID, {
          categoryName,
          isListed: req.body.cat_status
        });
    res.status(200).json({ success: true });
    }
    // res.redirect('/admin/categories');
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