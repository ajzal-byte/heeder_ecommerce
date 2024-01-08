const category = require('../../models/category_schema');


// view category
const getCategories = async (req, res)=>{
  try{
      const categories = await category.find();
      res.render('page_categories', { categories});
  }catch (error) {
    console.error(error);
  }
}

// add category
const addCategories = async (req, res)=>{
  try{
    const categoryName = req.query.categoryName.toLowerCase();
    const ifExist = await category.findOne({categoryName});
  if(ifExist){
    res.status(200).json({error: "Category already exists"})
  }else{
    await category.create({
      categoryName,
      isListed : "Active"
    });
    res.status(200).json({ success: true });
  }
  }catch (error) {
    console.error(error);
  }
}

//view edit category page
const editCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
  const category_edit = await category.findById(category_id);
  res.render('edit_category', {category_edit})
  }catch (error) {
    console.error(error);
  }
}


const updateCategories = async (req, res)=>{
  try{
    const categoryID = req.query.categoryID;
    const categoryName = req.query.categoryName.toLowerCase();
    const ifExist = await category.findOne({categoryName, _id : {$ne:categoryID}});
    if(ifExist){
 
      res.status(200).json({error: "Category already exists"})
    }else{
      await category.findByIdAndUpdate(categoryID, {
          categoryName,
          isListed: req.body.cat_status
        });
    res.status(200).json({ success: true });
    }
  }catch (error) {
    console.error(error);
  }
}

const blockCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
    await category.findByIdAndUpdate(category_id, {isListed: 'Inactive'});
    const categories = await category.find(); 
    res.redirect('/admin/categories');
  }catch (error) {
    console.error(error);
  }
}

const unblockCategories = async (req, res)=>{
  try{
    const category_id = req.params.category_id;
    await category.findByIdAndUpdate(category_id, {isListed: 'Active'});
    const categories = await category.find(); 
    res.redirect('/admin/categories');
  }catch (error) {
    console.error(error);
  }
}

module.exports = {
  getCategories,
  addCategories,
  editCategories,
  updateCategories,
  blockCategories,
  unblockCategories
}